import React, { useEffect, useContext, useState } from 'react';
import SocketContext from '../contexts/SocketContext';
import WhiteboardContext from '../contexts/WhiteboardContext';
import ChannelContext from '../contexts/ChannelContext';
import UserContext from '../contexts/UserContext';

const useWhiteboard = () => {
  const { socket } = useContext(SocketContext);
  const { contextRef, draw, color, bgColor, removeAllCursors, leaveWhiteboard, tool } = useContext(WhiteboardContext);
  const { selectedChannel, whiteboardChannels } = useContext(ChannelContext);
  const { user } = useContext(UserContext);
  const [textToDraw, setTextToDraw] = useState('');
  let isDrawing = false;
  let x0 = null;
  let y0 = null;
  
  useEffect(() => {
    window.addEventListener("beforeunload", ev => {  
      ev.preventDefault();
      leaveWhiteboard(socket, selectedChannel);
    });

    contextRef.current = document.querySelector('#whiteboard').getContext('2d');

    return () => {
      removeAllCursors();
    };
  }, []);

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
        colorHex = bgColor.slice(1);

      draw(x0, y0, x, y, tool.lineWidth, '#' + colorHex, true, socket, selectedChannel.name);
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
      colorHex = bgColor.slice(1);

    draw(x0, y0, x, y, tool.lineWidth, '#' + colorHex, true, socket, selectedChannel.name);
  }

  const mouseDownHelper = e => {
    switch (tool.name) {
      case 'tool-pointer': 
        break;
      case 'tool-pencil':
        startDraw(e);
        break;
      case 'tool-eraser':
        startDraw(e)
        break;
      case 'tool-text':
        const drawTextForm= document.querySelector('.draw-text-form'); 
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
          input.addEventListener('input', e => console.log(e.target.value));
          form.addEventListener('submit', e => {
            e.preventDefault();
            form.remove();
            context.fillText(textToDraw, x0, y0);
            // setTextToDraw('');
          })
          form.appendChild(input);
          document.querySelector('.whiteboard-canvas').appendChild(form);
          break;
        } else {
          drawTextForm.remove();
          context.fillText(textToDraw, x0, y0);
          setTextToDraw('');
        }
    }
  }

  const mouseMoveHelper = e => {
    switch (tool.name) {
      case 'tool-pointer': 
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