import React, { useEffect, useContext, useState } from 'react';
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
    draw, 
    color, 
    bgColor, 
    removeAllCursors, 
    leaveWhiteboard, 
    tool,
    cacheShape,
    redrawCanvas,
    isMouseOnShape,
    shapes,
    drawBoundingRect,
    dragShape
  } = useContext(WhiteboardContext);
  let isDrawing = false;
  let shapeIndex = null;
  let x0 = null;
  let y0 = null;
  
  useEffect(() => {
    contextRef.current = document.querySelector('#whiteboard').getContext('2d');
    
    return () => {
      removeAllCursors();
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
    shapeIndex = shapes.length;
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

      draw(x0, y0, x, y, tool.lineWidth, '#' + colorHex, true, socket, selectedChannel.name);
      cacheShape(x0, y0, x, y, shapeIndex, '#' + colorHex, tool.lineWidth, tool.lineStyle);
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

    
    draw(x0, y0, x, y, tool.lineWidth, '#' + colorHex, true, socket, selectedChannel.name);
    cacheShape(x0, y0, x, y, shapeIndex, '#' + colorHex, tool.lineWidth, tool.lineStyle);
    // redrawCanvas();
  }

  const mouseDownHelper = e => {
    switch (tool.name) {
      case 'tool-pointer':
        const [x, y] = calculateCanvasCoord(e.clientX, e.clientY);
        shapeIndex = isMouseOnShape(x, y);
        if (shapeIndex > -1) {
          drawBoundingRect(shapeIndex);
          isDrawing = true;
          x0 = x;
          y0 = y;
        } else {
          redrawCanvas();
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
        const drawTextForm = document.querySelector('.draw-text-form');
        const drawTextInput = document.querySelector('.draw-text-input');
        const canvas = document.querySelector('canvas').getBoundingClientRect();
        const context = document.querySelector('canvas').getContext('2d');

        if (!drawTextForm) {
          const form = document.createElement('form');
          const input = document.createElement('input');
          x0 = e.clientX - canvas.left;
          y0 = e.clientY - canvas.top;
          input.setAttribute('type', 'text');
          input.setAttribute('class', 'draw-text-input');
          form.setAttribute('class', 'draw-text-form')
          input.style.position = 'absolute';
          input.style.left = `${x0}px`;
          input.style.top = `${y0 - 10}px`;
          form.addEventListener('submit', e => {
            e.preventDefault();
            form.remove();
            context.fillText(input.value, x0, y0);
          })
          form.appendChild(input);
          document.querySelector('.whiteboard-canvas').appendChild(form);
        } else {
          context.fillText(drawTextInput.value, x0, y0);
          drawTextForm.remove();
          console.log(x0, y0);
        }
        break;
    }
  }

  const mouseMoveHelper = e => {
    const [x, y] = calculateCanvasCoord(e.clientX, e.clientY);
    switch (tool.name) {
      case 'tool-pointer':
        if (isDrawing) {
          dragShape(shapeIndex, x0, y0, x, y);
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

  return [handleOnMouseDown, handleOnMouseUp, handleOnMouseMove, renderActiveArtists];
}


export default useWhiteboard;