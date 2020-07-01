import React, { useContext } from 'react';

import ToolKit from './ToolKit';
import Tool from './Tool'; 
import WhiteBoardContext from '../../../contexts/WhiteboardContext';
import HexInput from './HexInput';

import TextField from '@material-ui/core/TextField';

const LeftIsland = () =>{
  const {color, setColor} = useContext(WhiteBoardContext);

  return(
    <div className="left-island">
      <div className="stroke-label">Stroke</div>

      <HexInput
        id="strokecolor"
        className="hex-color-input"
        // error={hexError}
        value={color}
        autoComplete="off"
        variant="outlined"
        // helperText={hexError? 'Must be valid hex.' : ''}
        onChange={e => setColor(e.target.value) }
      />
    </div>
  )
}

export default LeftIsland;