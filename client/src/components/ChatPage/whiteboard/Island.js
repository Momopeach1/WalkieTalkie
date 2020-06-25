import React, { useContext, useState } from 'react';

import ToolKit from './ToolKit';
import SysTool from './SysTool'; 
import useIsland from '../../../hooks/whiteboard/useIsland';
import WhiteboardContext from '../../../contexts/WhiteboardContext';

import TextField from '@material-ui/core/TextField';

const Island = () =>{
  const [handleOnClear, handleOnSubmit, hexError] = useIsland();
  const { bgColor, setBgColor } = useContext(WhiteboardContext);

  return(
    <div className="whiteboard-island">
      <SysTool name="systool" id="island-delete" handleOnClick={handleOnClear}>{ToolKit.DELETE}</SysTool>
      <SysTool name="systool" id="island-save">{ToolKit.SAVE}</SysTool>
      <form onSubmit={e => handleOnSubmit(e) }>
        <TextField
              id="bgcolor"
              error={hexError}
              value={bgColor}
              autoComplete="off"
              variant="outlined"
              helperText={hexError? 'Must be valid hex.' : ''}
              onChange={e => setBgColor(e.target.value) }
            >
        </TextField>
      </form>
    </div>
  )
}

export default Island;