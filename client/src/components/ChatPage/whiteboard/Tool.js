import React from 'react';

import useTool from '../../../hooks/whiteboard/useTool';

const Tool = ({ children, name, id, cursor }) =>{
  const [handleOnToolSelect] = useTool(id, cursor);

  return(
    <label className="">
      <input type="radio" name={name} id={id} onClick={/*() => document.querySelector('canvas').appendChild(style)*/handleOnToolSelect} />
      <div>
        { children }
      </div>

    </label>
  )
}

export default Tool;