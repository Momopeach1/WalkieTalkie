import React, { useEffect, useContext } from 'react';
import SocketContext from '../contexts/SocketContext';
import WhiteboardContext from '../contexts/WhiteboardContext';
import ChannelContext from '../contexts/ChannelContext';
import UserContext from '../contexts/UserContext';

const useWhiteboard = () => {
  const { socket } = useContext(SocketContext);
  const { contextRef, draw, color, toolRef, bgRef, removeAllCursors, leaveWhiteboard } = useContext(WhiteboardContext);
  const { selectedChannel, whiteboardChannels } = useContext(ChannelContext);
  const { user } = useContext(UserContext);
  let isDrawing = false;
  let x0 = null;
  let y0 = null;
  
  useEffect(() => {
    window.addEventListener("beforeunload", ev => {  
      ev.preventDefault();
      leaveWhiteboard(socket, selectedChannel);
    });

    contextRef.current = document.querySelector('#whiteboard').getContext('2d');
    
    // Fill background with default color
    document.querySelector('canvas').style.background = bgRef.current;

    return () => {
      removeAllCursors();
    };
  }, []);

  useEffect(() => {
    // Continue here tomorrow.
  }, [toolRef]);

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
      
      if (toolRef.current.name === 'tool-eraser') 
        colorHex = bgRef.current.slice(1);

      draw(x0, y0, x, y, toolRef.current.lineWidth, '#' + colorHex, true, socket, selectedChannel.name);
      x0 = x;
      y0 = y;
    }
  }

  const endDraw = e => {
    if (!isDrawing) return;
    const [x, y] = calculateCanvasCoord(e.clientX, e.clientY);
    isDrawing = false;
    draw(x0, y0, x, y, toolRef.current.lineWidth, '#' + color, true, socket, selectedChannel.name);
  }

  const mouseDownHelper = e => {
    switch (toolRef.current.name) {
      case 'tool-pointer': 
        break;
      case 'tool-pencil':
        startDraw(e);
        break;
      case 'tool-eraser':
        startDraw(e)
        break;
      case 'tool-text':
        break;
    }
  }

  const mouseMoveHelper = e => {
    switch (toolRef.current.name) {
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
    switch (toolRef.current.name) {
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