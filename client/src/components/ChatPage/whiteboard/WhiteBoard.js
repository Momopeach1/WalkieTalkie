import React from 'react';

import '../../../styles/Whiteboard.css';
import useWhiteboard from '../../../hooks/useWhiteboard';
import ToolBox from './ToolBox';
import Island from './Island';
import LeftIsland from './LeftIsland';

const WhiteBoard = () => {
  const [handleOnMouseDown, handleOnMouseUp, handleOnMouseMove, renderActiveArtists] = useWhiteboard();

  return (
    <div className="whiteboard-canvas" onScroll={() => {
      const drawUI = document.querySelector('.draw-ui');
      const whiteboardCanvas = document.querySelector('.whiteboard-canvas');
      const activeArtists = document.querySelector('.active-artists');
      drawUI.style.top = `${whiteboardCanvas.scrollTop}px`;
      drawUI.style.left = `${whiteboardCanvas.scrollLeft}px`;
      activeArtists.style.top = `${whiteboardCanvas.scrollTop + whiteboardCanvas.clientHeight - 45}px`;
    }}>

      <div className="row draw-ui" style={{ position: "absolute", top: "0", left: "0" }}>
        <div className="col-4">
          <div className="row island-row">
            <div className="col-12">
              <Island />
            </div>
          </div>
          <div className="row">
            <div className="col-12">
              <LeftIsland />
            </div>
          </div>
        </div>
        <div className="col-4 center">
          <ToolBox />
        </div>
        <div className="col-4"></div>
      </div>
      
      <canvas 
        id="whiteboard"
        onMouseDown={handleOnMouseDown}
        onMouseMove={handleOnMouseMove}
        onMouseUp={handleOnMouseUp}
        onMouseOut={handleOnMouseUp}
        width="7680"
        height="4320"
      >
      </canvas>
      <div className="active-artists">
        {renderActiveArtists()}
      </div>
    </div>
  ) 
};

export default WhiteBoard;