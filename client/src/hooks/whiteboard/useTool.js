import React, { useContext } from 'react';

import WhiteboardContext from '../../contexts/WhiteboardContext';

const useTool = (id, cursor) => {
  const { toolRef } = useContext(WhiteboardContext);

  // var css = `canvas:hover{ cursor: ${cursor} }`;
  // var style = document.createElement('style');
  
  // if (style.styleSheet) {
  //     style.styleSheet.cssText = css;
  // } else {
  //     style.appendChild(document.createTextNode(css));
  // }

  const handleOnToolSelect = () => {
    // document.querySelector('canvas').appendChild(style);
    toolRef.current.cursorImg = cursor;
    toolRef.current.name = id;
    if (id === 'tool-eraser') toolRef.current.lineWidth = 30;
    else if (id === 'tool-pencil') toolRef.current.lineWidth = 2;
  }

  return [handleOnToolSelect];
}

export default useTool;