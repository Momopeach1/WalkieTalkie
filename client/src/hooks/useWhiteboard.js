import React, { useEffect, useContext } from 'react';
import SocketContext from '../contexts/SocketContext';
import WhiteboardContext from '../contexts/WhiteboardContext';
import ChannelContext from '../contexts/ChannelContext';
import WhiteBoard from '../components/ChatPage/whiteboard/WhiteBoard';
import server from '../apis/server';


const useWhiteboard = () => {
  const { socket } = useContext(SocketContext);
  const { whiteboards, contextRef, draw, color } = useContext(WhiteboardContext);
  const { selectedChannel, whiteboardChannels } = useContext(ChannelContext);
  let isDrawing = false;
  let x0 = null;
  let y0 = null;
  
  useEffect(() => {
    window.addEventListener("beforeunload", (ev) => {  
        ev.preventDefault();
        socket.emit('testing', {});
        const canvas = document.querySelector('canvas');
        //if (whiteboardChannels.find(w => w.name === selectedChannel.name).artists.length === 1)
        server.put('/whiteboard/save', { name: selectedChannel.name, dataURL: canvas.toDataURL() })
        //return ev.returnValue = 'Are you sure you want to close?';
    });

    contextRef.current = document.querySelector('#whiteboard').getContext('2d');
    document.querySelector('canvas').style.width = '100%';
    document.querySelector('canvas').style.height = '100%';
    document.querySelector('canvas').width = document.querySelector('canvas').offsetWidth;
    document.querySelector('canvas').height = document.querySelector('canvas').offsetHeight;
    window.addEventListener("resize", () => {
      var data = document.querySelector('canvas').toDataURL();
      document.querySelector('canvas').width = document.querySelector('canvas').offsetWidth;
      document.querySelector('canvas').height = document.querySelector('canvas').offsetHeight;
      const context = document.querySelector('canvas').getContext('2d');
      const img = new Image();
      img.onload = () => {
          context.drawImage(
            img, 0, 0, img.width, img.height, 0, 0, 
            document.querySelector('canvas').width, document.querySelector('canvas').height
          );
      }
      img.src = data;
    });
  }, [])

  const handleOnMouseDown = e => {
    console.log('MOUSE DOWN !!!!')
    isDrawing = true;
    const [x, y] = calculateCanvasCoord(e.clientX, e.clientY);
    x0 = x;
    y0 = y;
  }

  const handleOnMouseMove = e => {
    if (isDrawing) {
      console.log("MOUSE MOVING!!!")
      const [x, y] = calculateCanvasCoord(e.clientX, e.clientY);
      draw(x0, y0, x, y, '#' + color, true, socket, selectedChannel.name);
      x0 = x;
      y0 = y;
    }
  }

  const handleOnMouseUp = e => {
    if (!isDrawing) return;
    console.log('Mouse Up pressed!!!');
    const [x, y] = calculateCanvasCoord(e.clientX, e.clientY);
    isDrawing = false;
    draw(x0, y0, x, y, '#' + color, true, socket, selectedChannel.name);
  }

  const calculateCanvasCoord = (x, y) => {
    const canvas = document.querySelector('canvas').getBoundingClientRect();
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

  return [handleOnMouseDown, handleOnMouseUp, handleOnMouseMove, renderActiveArtists];
}


export default useWhiteboard;