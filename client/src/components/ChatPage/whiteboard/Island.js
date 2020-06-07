import React from 'react';

import ToolKit from './ToolKit';
import Tool from './Tool'; 

const Island = () =>{
  return(
    <div className="whiteboard-island">
      <Tool name="systool" id="island-delete">{ToolKit.DELETE}</Tool>
      <Tool name="systool" id="island-save">{ToolKit.SAVE}</Tool>
    </div>
  )
}

export default Island;