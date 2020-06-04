import React from 'react';

import '../../../styles/Whiteboard.css';
import useWhiteboard from '../../../hooks/useWhiteboard';

const WhiteBoard = () => {
   const [handleOnMouseDown, handleOnMouseUp, handleOnMouseMove] = useWhiteboard();
  return <div className="whiteboard-canvas">
    <canvas 
      id="whiteboard" 
      onMouseDown={handleOnMouseDown}
      onMouseMove={handleOnMouseMove}
      onMouseUp={handleOnMouseUp}
      onMouseOut={handleOnMouseUp}
    />
  </div>
};

export default WhiteBoard;