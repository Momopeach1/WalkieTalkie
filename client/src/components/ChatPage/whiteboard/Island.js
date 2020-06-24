import React, { useContext } from 'react';

import ToolKit from './ToolKit';
import SysTool from './SysTool'; 
import useIsland from '../../../hooks/whiteboard/useIsland';
import WhiteboardContext from '../../../contexts/WhiteboardContext';

import TextField from '@material-ui/core/TextField';

const Island = () =>{
  const [handleOnClear] = useIsland();
  //need to be state
  const { bgRef } = useContext(WhiteboardContext);

  return(
    <div className="whiteboard-island">
      <SysTool name="systool" id="island-delete" handleOnClick={handleOnClear}>{ToolKit.DELETE}</SysTool>
      <SysTool name="systool" id="island-save">{ToolKit.SAVE}</SysTool>
      <TextField
            id="bgcolor"
            value={bgRef.current}
            autoComplete="off"
            variant="outlined"
            onChange={e => {
              bgRef.current = e.target.value;
              document.querySelector('canvas').style.backgroundColor = e.target.value;
            }}
          >
          </TextField>
    </div>
  )
}

export default Island;