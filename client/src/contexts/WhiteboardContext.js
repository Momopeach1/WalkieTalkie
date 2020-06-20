import React, { useRef, useState, useContext } from 'react';

const WhiteboardContext = React.createContext();

export const WhiteboardProvider = ({ children }) => {
  const contextRef = useRef(null);
  const [whiteboards, setWhiteboards] = useState([]);
  const [color, setColor] = useState('000');
  const toolRef = useRef({ lineWidth: 2, name: 'tool-pointer' });
  
  const draw = (x0, y0, x1, y1, lineWidth, color, emit, socket, channelName) => {
    if (contextRef.current) {
      let context = contextRef.current;
      context.lineWidth = toolRef.current.lineWidth;
      context.beginPath();
      context.arc(x0, y0, contextRef.current.lineWidth / 2, 0, Math.PI * 2);
      //context.moveTo(x0, y0);
      //context.lineTo(x1, y1);
      context.strokeStyle = color;
      context.stroke();
      context.closePath();

      if (!emit) return;

      const { left, top } = document.querySelector('canvas').getBoundingClientRect();
      socket.emit("drawing path", {
        x0/*: (x0 + left) / window.innerWidth*/,
        y0/*: (y0 + top) / window.innerHeight*/,
        x1/*: (x1 + left) / window.innerWidth*/,
        y1/*: (y1 + top) / window.innerHeight*/,
        lineWidth: toolRef.current.lineWidth,
        color,
        channelName
      });
    }
  }

  return <WhiteboardContext.Provider value={{ contextRef, draw, whiteboards, setWhiteboards, color, setColor, toolRef }}>
    {children}
  </WhiteboardContext.Provider>
}

export default WhiteboardContext;