import React from 'react';

import '../../../styles/Whiteboard.css';
import useWhiteboard from '../../../hooks/useWhiteboard';
import ToolBox from './ToolBox';
import Island from './Island';
import LeftIsland from './LeftIsland';

const WhiteBoard = () => {
   const [handleOnMouseDown, handleOnMouseUp, handleOnMouseMove, renderActiveArtists] = useWhiteboard();
  return (
    <div className="whiteboard-canvas">
      <div className="archipelago">
        <Island />
        {/* <LeftIsland /> */}
      </div>
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