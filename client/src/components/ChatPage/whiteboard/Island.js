import React from 'react';

import ToolKit from './ToolKit';
import SysTool from './SysTool'; 
import useIsland from '../../../hooks/whiteboard/useIsland';

const Island = () =>{
  const [handleOnClear] = useIsland();

  return(
    <div className="whiteboard-island">
      <SysTool name="systool" id="island-delete" handleOnClick={handleOnClear}>{ToolKit.DELETE}</SysTool>
      <SysTool name="systool" id="island-save">{ToolKit.SAVE}</SysTool>
    </div>
  )
}

export default Island;