import React from 'react';

const Tool = ({ children, name, id, cursor }) =>{
  var css = `canvas:hover{ cursor: ${cursor} }`;
  var style = document.createElement('style');
  
  if (style.styleSheet) {
      style.styleSheet.cssText = css;
  } else {
      style.appendChild(document.createTextNode(css));
  }

  return(
    <label className="">
      <input type="radio" name={name} id={id} onClick={() => document.querySelector('canvas').appendChild(style)} />
      <div>
        { children }
      </div>

    </label>
  )
}

export default Tool;