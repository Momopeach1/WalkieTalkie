import React, { useEffect, useContext } from 'react';
import SocketContext from '../contexts/SocketContext';
import WhiteboardContext from '../contexts/WhiteboardContext';
import ChannelContext from '../contexts/ChannelContext';
import UserContext from '../contexts/UserContext';

const useWhiteboard = () => {
  const { socket } = useContext(SocketContext);
  const { selectedChannel, whiteboardChannels } = useContext(ChannelContext);
  const { user } = useContext(UserContext);
  const { 
    contextRef, 
    color, 
    bgColor, 
    removeAllCursors, 
    leaveWhiteboard, 
    tool,
    redrawCanvas,
    isMouseOnShape,
    drawBoundingRect,
    shapesRef,
    cacheShape
  } = useContext(WhiteboardContext);
  let isDrawing = false;
  let shapeIndex = null;
  let x0 = null;
  let y0 = null;
  
  const onkeydown = e => {
    if (e.keyCode == 90 && e.ctrlKey) {
      socket.emit('undo', { channelName: selectedChannel.name });
    }
  }

  useEffect(() => {
    contextRef.current = document.querySelector('#whiteboard').getContext('2d');
    window.addEventListener('keydown', onkeydown);
    
    return () => {
      removeAllCursors();
      window.removeEventListener('keydown', onkeydown);
    };
  }, []);
  

  const onBeforeUnload = ev => {
    ev.preventDefault();
    leaveWhiteboard(socket, selectedChannel);
  }
  
  useEffect(() => {
    window.addEventListener("beforeunload", onBeforeUnload);

    return () => window.removeEventListener("beforeunload", onBeforeUnload);
  }, [bgColor, selectedChannel])

  useEffect(() => {
    const css = `canvas:hover{ cursor: ${tool.cursorImg} }`;
    const style = document.createElement('style');

    if (style.styleSheet) {
      style.styleSheet.cssText = css;
    } else {
      style.appendChild(document.createTextNode(css));
    }

    document.querySelector('canvas').appendChild(style);
  }, [tool]);

  const startDraw = e => {
    isDrawing = true;
    const [x, y] = calculateCanvasCoord(e.clientX, e.clientY);
    x0 = x;
    y0 = y;
    shapeIndex = shapesRef.current.length;
  }

  const continueDraw = e => {
    const { left, top } = document.querySelector('canvas').getBoundingClientRect();

    socket.emit('moving mouse', {
      x: e.clientX - left,
      y: e.clientY - top,
      channelName: selectedChannel.name,
      displayName: user.displayName
    });

    if (isDrawing) {
      const [x, y] = calculateCanvasCoord(e.clientX, e.clientY);
      let colorHex = color;
      
      if (tool.name === 'tool-eraser') 
        colorHex = bgColor;

      cacheShape(x0, y0, x, y, shapeIndex, '#' + colorHex, tool.lineWidth, tool.lineStyle, 'path');
      socket.emit('drawing path', { 
        x0, 
        y0, 
        x, 
        y, 
        shapeIndex, 
        strokeColor: '#' + colorHex, 
        lineWidth: tool.lineWidth, 
        lineStyle: tool.lineStyle,
        channelName: selectedChannel.name,
        type: 'path'
      });
      
      x0 = x;
      y0 = y;
    }
  }

  const endDraw = e => {
    if (!isDrawing) return;
    const [x, y] = calculateCanvasCoord(e.clientX, e.clientY);
    let colorHex = color;
    isDrawing = false;

    if (tool.name === 'tool-eraser') 
      colorHex = bgColor;
  }

  const mouseDownHelper = e => {
    switch (tool.name) {
      case 'tool-pointer':
        const [x, y] = calculateCanvasCoord(e.clientX, e.clientY);
        shapeIndex = isMouseOnShape(x, y);
        redrawCanvas();
        if (shapeIndex !== null && shapeIndex > -1) {
          console.log('mouse down pointer')
          drawBoundingRect(shapeIndex);
          isDrawing = true;
          x0 = x;
          y0 = y;
        } else {
          isDrawing = false;
        }
        break;
      case 'tool-pencil':
        startDraw(e);
        break;
      case 'tool-eraser':
        startDraw(e)
        break;
      case 'tool-text':
        const drawTextArea = document.querySelector('.draw-textarea');
        const canvas = document.querySelector('canvas').getBoundingClientRect();

        if (!drawTextArea) {
          const textarea = document.createElement('textarea');
          textarea.setAttribute('class', 'draw-textarea');

          x0 = e.clientX - canvas.left;
          y0 = e.clientY - canvas.top;
          textarea.style.left = `${x0}px`;
          textarea.style.top = `${y0 - 10}px`;
          textarea.style.color = '#000';
          textarea.style.fontFamily = 'whitney-medium';
          textarea.style.fontSize = '20px';
          textarea.style.lineHeight = '20px';
          textarea.style.whiteSpace = 'pre';
          textarea.style.height = '20px';
          textarea.setAttribute('class', 'draw-textarea');
          textarea.autofocus = true;
          
          //this needed because querySelector is async so new text areas wont focus.
          document.querySelector('.whiteboard-canvas').appendChild(textarea);
          setTimeout(() => textarea.focus(), 0);
          
          textarea.addEventListener('input', e => {
            textarea.style.width = textarea.scrollWidth + 'px';
            textarea.style.height = textarea.scrollHeight + 'px';
          });

        } else {
          shapeIndex = shapesRef.current.length;
          socket.emit('draw text', {
            x0, 
            y0, 
            x1: x0 + drawTextArea.offsetWidth, 
            y1: y0 + drawTextArea.offsetHeight - 15, 
            shapeIndex, 
            color: '#000000', 
            fontSize: 20, 
            fontStyle: 'solid', 
            type: 'text', 
            text: drawTextArea.value,
            channelName: selectedChannel.name
          });
          // cacheShape(x0, y0, x0 + drawTextArea.offsetWidth, y0 + drawTextArea.offsetHeight - 15, shapeIndex, '#000000', 2, 'solid', 'text', drawTextArea.value);
          drawTextArea.remove();
          // redrawCanvas();
        }

        break;
    }
  }

  const mouseMoveHelper = e => {
    const [x, y] = calculateCanvasCoord(e.clientX, e.clientY);
    switch (tool.name) {
      case 'tool-pointer':
        if (isDrawing) {
          //dragShape(shapeIndex, x0, y0, x, y);
          socket.emit('drag shape', { shapeIndex, x0, y0, x, y, channelName: selectedChannel.name });
          drawBoundingRect(shapeIndex);
          x0 = x;
          y0 = y;
        }
        break;
      case 'tool-pencil':
        continueDraw(e);
        break;
      case 'tool-eraser':
        continueDraw(e)
        break;
      case 'tool-text':
        break;
    }
  }

  const mouseUpHelper = e => {
    switch (tool.name) {
      case 'tool-pointer':
        if (shapeIndex !== null && shapeIndex >= 0) {
          console.log('mouse up detected')
          drawBoundingRect(shapeIndex);
        }
        isDrawing = false;
        break;
      case 'tool-pencil':
        endDraw(e);
        break;
      case 'tool-eraser':
        endDraw(e)
        break;
      case 'tool-text':
        break;
    }
  }

  const handleOnMouseDown = e => {
    mouseDownHelper(e);
  }

  const handleOnMouseMove = e => {
    mouseMoveHelper(e);
  }

  const handleOnMouseUp = e => {
    mouseUpHelper(e);
  }

  const calculateCanvasCoord = (x, y) => {
    const canvas = document.querySelector('canvas').getBoundingClientRect();
    return [x - canvas.left, y - canvas.top]
  }

  // Active artists fixed in canvas.
  const renderActiveArtists = () => {
    return whiteboardChannels.length && whiteboardChannels.find(w => w.name === selectedChannel.name).artists.map(a => {
      return (
        <img className="whiteboard-avatar" src={a.photoURL} />
      );
    });
  };

  function throttle(callback, delay) {
    var previousCall = new Date().getTime();
    return function() {
      var time = new Date().getTime();

      if ((time - previousCall) >= delay) {
        previousCall = time;
        callback.apply(null, arguments);
      }
    };
  }

  return [handleOnMouseDown, handleOnMouseUp, handleOnMouseMove, renderActiveArtists, throttle];
}


export default useWhiteboard;