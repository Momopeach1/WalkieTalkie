import React from 'react';

import ToolKit from './ToolKit';
import Tool from './Tool';

const ToolBox = () =>{
  return(
    <div className="tool-box">
      <Tool name="tool" id="tool-pointer">{ToolKit.POINTER}</Tool>
      <Tool name="tool" id="tool-pencil">{ToolKit.PENCIL}</Tool>
      <Tool name="tool" id="tool-text" cursor="text">{ToolKit.TEXT}</Tool>
    </div>
  )
}

export default ToolBox;