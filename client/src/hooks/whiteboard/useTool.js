import React, { useContext } from 'react';

import WhiteboardContext from '../../contexts/WhiteboardContext';

const useTool = (id, cursor) => {
  const { setTool, redrawCanvas } = useContext(WhiteboardContext);

  const handleOnToolSelect = () => {
    redrawCanvas();
    setTool(prevTool => { return { ...prevTool, cursorImg: cursor, name: id } })
    if (id === 'tool-eraser') 
      setTool(prevTool => { return { ...prevTool, lineWidth: 30 } })
    else if (id === 'tool-pencil') 
      setTool(prevTool => { return { ...prevTool, lineWidth: 2 } })
  }

  return [handleOnToolSelect];
}

export default useTool;