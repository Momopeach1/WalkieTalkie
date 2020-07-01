import React from 'react';

import TextField from '@material-ui/core/TextField';

const HexInput = props => {
  return (
    <div className="hex-input-container">
      <div className="hex-symbol">#</div>
      <TextField { ...props }></TextField>
    </div>
  );
};

export default HexInput;