import React, { useEffect, useRef } from 'react';

const useWhiteboard = () => {
  const contextRef = useRef(null);
  let isDrawing = false;
  let x0 = null;
  let y0 = null;
  
  useEffect(() => {
    contextRef.current = document.querySelector('#whiteboard').getContext('2d');
    // document.querySelector('canvas').style.width = '100%';
    // document.querySelector('canvas').style.height = '100%';
    // document.querySelector('canvas').width = document.querySelector('canvas').offsetWidth;
    // document.querySelector('canvas').height = document.querySelector('canvas').offsetHeight;
  }, [])

  const handleOnMouseDown = e => {
    isDrawing = true;
    x0 = e.clientX;
    y0 = e.clientY;
  }

  const handleOnMouseMove = e => {
    if (isDrawing) {
      draw(x0, y0, e.clientX, e.clientY, 'yellow');
      x0 = e.clientX;
      y0 = e.clientY;
    }
  }

  const handleOnMouseUp = e => {
    if (!isDrawing) return;
    isDrawing = false;
    draw(x0, y0, e.clientX, e.clientY, 'yellow');
  }

  const draw = (x0, y0, x1, y1, color) => {
    if (contextRef.current) {
      let context = contextRef.current;
      console.log('esdfsdf')
      context.beginPath();
      context.moveTo(x0, y0);
      context.lineTo(x1, y1);
      context.strokeStyle = color;
      context.lineWidth = 2;
      context.stroke();
      context.closePath();
    }
  }
  return [draw, handleOnMouseDown, handleOnMouseMove, handleOnMouseUp];
}


export default useWhiteboard;