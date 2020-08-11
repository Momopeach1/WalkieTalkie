import React, { useContext } from 'react';
import WhiteboardContext from '../../../../contexts/WhiteboardContext';
import HexInput from '../HexInput';


const TextContent = () => {

  const { color, setColor, changeFontSize } = useContext(WhiteboardContext);

  return(
  <>
    <div className="stroke-label">Text Style</div>
    <HexInput
      id="strokecolor"
      className="hex-color-input"
      // error={hexError}
      value={color}
      autoComplete="off"
      variant="outlined"
      handleOnColorClick={(e, color) => setColor(color)}
      colors={
        ['#000000', '#c92a2a', '#862e9c',
          '#364fc7', '#087f5b', '#0b7285',
          '#FFFF00', '#e67700', '#5f3dc4'
        ]
      }
      // helperText={hexError? 'Must be valid hex.' : ''}
      onChange={e => setColor(e.target.value)}
    />
    <div className="text-options">

      <div className="options-header">Font Size</div>
      <label onClick={() => changeFontSize(20)} className="stroke-option-label" >
          <input  className="stroke-radio" type="radio" />
          Small
        </label>
        <label onClick={() => changeFontSize(26)} className="stroke-option-label" >
          <input  className="stroke-radio" type="radio" />
          Medium 
        </label>
        <label onClick={() => changeFontSize(32)} className="stroke-option-label" >
          <input  className="stroke-radio" type="radio" />
          Large
        </label>

        <div className="options-header">Font Family</div>
        <label onClick={() => console.log('kjfndsk')} className="stroke-option-label" >
          <input  className="stroke-radio" type="radio" />
          Classic
        </label>
    </div>
  </>
  )
};

export default TextContent;