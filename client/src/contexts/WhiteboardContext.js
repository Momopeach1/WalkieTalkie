import React, { useRef, useState } from 'react';

import ToolKit from '../components/ChatPage/whiteboard/ToolKit';
import server from '../apis/server';

const WhiteboardContext = React.createContext();

export const WhiteboardProvider = ({ children }) => {
  const contextRef = useRef(null);
  /* 
      Shapes Def [{ 
        points: [{ x: number, y: number }, ...], 
        color: string, 
        width: number 
      }]
  */
  const shapesRef = useRef([]);
  const shapes = shapesRef.current;
  console.log('shapes from context', shapes);
  const [whiteboards, setWhiteboards] = useState([]);
  const [color, setColor] = useState('000000');
  const [bgColor, setBgColor] = useState('40444b');
  const [tool, setTool] = useState({
    lineWidth: 2,
    name: 'tool-pointer',
    cursorImg: ToolKit.POINTER_ICON
  });

  const onStrokeStyleChange = segments => {
    const ctx = document.querySelector('canvas').getContext('2d');
    ctx.setLineDash(segments);
  }

  const changeStrokeWidth = strokeWidth => {
    setTool(prevTool => {
      return { ...prevTool, lineWidth: strokeWidth };
    });
  };

  const onStrokeWidthChange = width => {
    changeStrokeWidth(width);
  }

  /*
    Used when:
      - Exit whiteboard channel. (useWhiteboard.js)
      - Join another whiteboard channel while inside a whiteboard channel. (useChannelGroup.js)
  */
  const removeAllCursors = () =>
    document.querySelectorAll('.cursor-container').forEach(n => n.remove());


  const cacheShape = (x0, y0, x1, y1, i) => {
    if (!shapes[i]) {
      shapes[i] = { x: x0, y: y0, points: [] };
    } else {
      shapes[i].points.push({ x: x1, y: y1 });
    }
  }

  const defineShape = (shape, isPath = false) => {
    const ctx = document.querySelector('canvas').getContext('2d');
    ctx.beginPath();
    ctx.moveTo(shape.x, shape.y);
    for (let point of shape.points) {
      ctx.lineTo(point.x, point.y);
      // if (isPath)
      //   ctx.moveTo(point.x, point.y);
    }
    // ctx.closePath();
  }

  const redrawCanvas = () => {
    const canvas = document.querySelector('canvas');
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.clientWidth, canvas.clientHeight);
    for (let shape of shapes) {
      ctx.lineJoin = 'round';
      ctx.strokeStyle = '#000000';
      ctx.lineWidth = 2;
      defineShape(shape, true);
      ctx.stroke();
    }
  }

  const isMouseOnShape = (x, y) => {
    const ctx = document.querySelector('canvas').getContext('2d');

    for (let shape of shapes) {
      ctx.beginPath();
      ctx.moveTo(shape.x, shape.y);
      for (let point of shape.points) {
        ctx.lineTo(point.x, point.y);
        // ctx.moveTo(point.x, point.y);
      }
      ctx.closePath();

      console.log('is point in path', ctx.isPointInPath(x, y));
      if (ctx.isPointInPath(x, y))
        return true;
    }
    return false;
  }

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

      socket.emit("drawing path", { x0, y0, x1, y1, lineWidth, color, channelName });
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
    leaveWhiteboard,
    cacheShape,
    redrawCanvas,
    isMouseOnShape,
    shapes,
    onStrokeWidthChange,
    onStrokeStyleChange
  }}>
    {children}
  </WhiteboardContext.Provider>
}

export default WhiteboardContext;