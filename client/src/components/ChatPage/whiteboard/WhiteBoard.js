import React from 'react';

import '../../../styles/Whiteboard.css';
import useWhiteboard from '../../../hooks/useWhiteboard';
import ToolBox from './ToolBox';
import Island from './Island';

const WhiteBoard = () => {
   const [handleOnMouseDown, handleOnMouseUp, handleOnMouseMove, renderActiveArtists] = useWhiteboard();
  return (
    <div className="whiteboard-canvas">
      <Island />
      <ToolBox />
      <canvas 
        id="whiteboard"
        onMouseDown={handleOnMouseDown}
        onMouseMove={handleOnMouseMove}
        onMouseUp={handleOnMouseUp}
        onMouseOut={handleOnMouseUp}
      >
      </canvas>
      <div className="active-artists">
        {renderActiveArtists()}
      </div>
    </div>
  ) 
};

export default WhiteBoard;