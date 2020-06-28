import React, { useContext } from 'react';

import ToolKit from './ToolKit';
import Tool from './Tool'; 
import WhiteBoardContext from '../../../contexts/WhiteboardContext';

import TextField from '@material-ui/core/TextField';

const LeftIsland = () =>{
  const {color, setColor} = useContext(WhiteBoardContext);

  return(
    <div className="left-island">
      <div className="stroke-label">Stroke</div>
      <div className="color-input-container">
        {/* <button></button> */}
        <label>
          {/* <div>
            #
          </div> */}
          <TextField
            id="stroke-color-hex"
            className="stroke-color-input"
            //classes={{ root: classes.textfield}}
            value={color}
            autoComplete="off"
            variant="outlined"
            onChange={e => setColor(e.target.value)}
          >
          </TextField>
        </label>
      </div>
    </div>
  )
}

export default LeftIsland;