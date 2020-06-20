import React, { useEffect, useContext } from 'react';
import SocketContext from '../contexts/SocketContext';
import WhiteboardContext from '../contexts/WhiteboardContext';
import ChannelContext from '../contexts/ChannelContext';
import server from '../apis/server';
import UserContext from '../contexts/UserContext';


const useWhiteboard = () => {
  const { socket } = useContext(SocketContext);
  const { contextRef, draw, color, toolRef } = useContext(WhiteboardContext);
  const { selectedChannel, whiteboardChannels } = useContext(ChannelContext);
  const { user } = useContext(UserContext);
  let isDrawing = false;
  let x0 = null;
  let y0 = null;
  
  useEffect(() => {
    window.addEventListener("beforeunload", async (ev) => {  
        ev.preventDefault();
        socket.emit('testing', {});
        const canvas = document.querySelector('canvas');
        //if (whiteboardChannels.find(w => w.name === selectedChannel.name).artists.length === 1)
        await server.put('/whiteboard/save', { name: selectedChannel.name, dataURL: canvas.toDataURL()})
        await server.delete('/whiteboard/leave', { data: { name: selectedChannel.name }})
        //return ev.returnValue = 'Are you sure you want to close?';
    });

    contextRef.current = document.querySelector('#whiteboard').getContext('2d');

    return () => {
      document.querySelectorAll('.cursor-container').forEach(n => n.remove());
    };
  }, [])

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

  const handleOnMouseDown = e => {
    console.log('MOUSE DOWN !!!!')
    isDrawing = true;
    const [x, y] = calculateCanvasCoord(e.clientX, e.clientY);
    x0 = x;
    y0 = y;
  }

  const handleOnMouseMove = e => {
    const { left, top } = document.querySelector('canvas').getBoundingClientRect();
    socket.emit('moving mouse', {
      // x: (e.clientX + left) / window.innerWidth,
      // y: (e.clientY + top) / window.innerHeight,
      x: e.clientX - left,
      y: e.clientY - top,
      channelName: selectedChannel.name,
      displayName: user.displayName
    });
    if (isDrawing) {
      console.log("MOUSE MOVING!!!")
      const [x, y] = calculateCanvasCoord(e.clientX, e.clientY);
      draw(x0, y0, x, y, toolRef.current.lineWidth, '#' + color, true, socket, selectedChannel.name);
      x0 = x;
      y0 = y;
    }
  }

  const handleOnMouseUp = e => {
    if (!isDrawing) return;
    console.log('Mouse Up pressed!!!');
    const [x, y] = calculateCanvasCoord(e.clientX, e.clientY);
    isDrawing = false;
    draw(x0, y0, x, y, toolRef.current.lineWidth, '#' + color, true, socket, selectedChannel.name);
  }

  const calculateCanvasCoord = (x, y) => {
    const canvas = document.querySelector('canvas').getBoundingClientRect();
    console.log('x', x, 'canvas.left', canvas.left, 'y', y, 'canvas.top', canvas.top);
    return [(x - canvas.left) /* / (window.innerWidth - 1) * (canvas.width - 1)*/, 
            (y - canvas.top) /* / (window.innerHeight - 1) * (canvas.height - 1)*/]
  }

  //for on canvas
  const renderActiveArtists = () => {
    return whiteboardChannels.length && whiteboardChannels.find(w => w.name === selectedChannel.name).artists.map(a => {
      return (
        <img className="whiteboard-avatar" src={a.photoURL} />
      );
    });
  };

  return [handleOnMouseDown, handleOnMouseUp, handleOnMouseMove, renderActiveArtists, throttle];
}


export default useWhiteboard;