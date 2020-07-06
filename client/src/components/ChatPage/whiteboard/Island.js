import React, { useContext, useState } from 'react';

import ToolKit from './ToolKit';
import SysTool from './SysTool';
import HexInput from './HexInput';
import useIsland from '../../../hooks/whiteboard/useIsland';
import WhiteboardContext from '../../../contexts/WhiteboardContext';

const Island = () =>{
  const [handleOnClear, handleOnSubmit, hexError] = useIsland();
  const { bgColor, setBgColor } = useContext(WhiteboardContext);

  return(
    <div className="whiteboard-island">
      <div className="row">
        <div className="col-12">
          <div className="systool-container">
            <SysTool name="systool" id="island-delete" handleOnClick={handleOnClear}>{ToolKit.DELETE}</SysTool>
            <SysTool name="systool" id="island-save">{ToolKit.SAVE}</SysTool>
          </div>
        </div>
      </div>
      <div className="row">
        <div className="col-12">
          <form onSubmit={e => handleOnSubmit(e, bgColor) }>
            <HexInput
              id="bgcolor"
              className="hex-color-input"
              error={hexError}
              value={bgColor}
              autoComplete="off"
              variant="outlined"
              handleOnColorClick={handleOnSubmit}
              helperText={hexError? 'Must be valid hex.' : ''}
              colors={
                ['#ffffff', '#fff4e6', '#fff9db',
                 '#f4fce3', '#ebfbee', '#e6fcf5',
                 '#edf2ff', '#f8f0fc', '#e3fafc'
                ]
              }
              onChange={e => setBgColor(e.target.value) }
            />
          </form>
        </div>
      </div>
    </div>
  )
}

export default Island;