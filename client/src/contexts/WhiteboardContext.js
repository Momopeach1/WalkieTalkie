import React, { useRef, useState } from 'react';

import ToolKit from '../components/ChatPage/whiteboard/ToolKit';
import server from '../apis/server';


const WhiteboardContext = React.createContext();

export const WhiteboardProvider = ({ children }) => {
  const contextRef = useRef(null);
  const [whiteboards, setWhiteboards] = useState([]);
  const [color, setColor] = useState('000000');
  const [bgColor, setBgColor] = useState('40444b');
  const [tool, setTool] = useState({ lineWidth: 2, name: 'tool-pointer', cursorImg: ToolKit.POINTER_ICON })

  /*
    Used when:
      - Exit whiteboard channel. (useWhiteboard.js)
      - Join another whiteboard channel while inside a whiteboard channel. (useChannelGroup.js)
  */
  const removeAllCursors = () => document.querySelectorAll('.cursor-container').forEach(n => n.remove());
  
  const draw = (x0, y0, x1, y1, lineWidth, color, emit, socket, channelName) => {
    if (contextRef.current) {
      let context = contextRef.current;
      context.lineWidth = lineWidth;
      context.lineJoin = 'round';
      context.beginPath();
      context.moveTo(x0, y0);
      context.lineTo(x1, y1);
      context.strokeStyle = color;
      context.closePath();
      context.stroke();

      if (!emit) return;

      socket.emit("drawing path", {x0, y0, x1, y1, lineWidth, color,channelName });
    }
  }

  const appendCursor = a => {
    const container = document.createElement("div");
    const img = document.createElement("IMG");
    const name = document.createElement('div');
    container.setAttribute('id', `container-${a.socketId}`);
    container.setAttribute('class', 'cursor-container');
    img.setAttribute('id', `cursor-${a.socketId}`);
    name.setAttribute('id', `name-${a.socketId}`);
    name.setAttribute('class', 'cursor-nametag');
    container.appendChild(img);
    container.appendChild(name);
    document.querySelector('.whiteboard-canvas').appendChild(container);
  }

  const leaveWhiteboard = (socket, selectedChannel) => {
    const canvas = document.querySelector('canvas');

    const requestBody = {
      name: selectedChannel.name,
      dataURL: canvas.toDataURL(),
      bgColor: '#' + bgColor
    }

    canvas.getContext('2d').clearRect(0, 0, canvas.clientWidth, canvas.clientHeight);

    server.delete('/whiteboard/leave', { data: requestBody })
      .then(() => socket.emit('leave whiteboard', { channelName: selectedChannel.name }))
      // .catch(onServerFailure);
  }

  return <WhiteboardContext.Provider value={{ 
    contextRef, 
    draw, 
    whiteboards, 
    setWhiteboards, 
    color, 
    setColor,
    tool,
    setTool,
    bgColor,
    setBgColor,
    removeAllCursors,
    appendCursor,
    leaveWhiteboard
  }}>
    {children}
  </WhiteboardContext.Provider>
}

export default WhiteboardContext;