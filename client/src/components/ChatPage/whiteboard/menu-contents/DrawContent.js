import React, { useContext } from 'react';

import HexInput from '../HexInput';
import WhiteboardContext from '../../../../contexts/WhiteboardContext';

const DrawContent = () => {
  const { color, setColor, onStrokeWidthChange, onStrokeStyleChange} = useContext(WhiteboardContext);

  return (
    <>
      <div className="stroke-label">Stroke</div>
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
      <div className="stroke-options">
        {/* stroke width  */}
        <div className="options-header">Stroke Width</div>
        <label onClick={() => onStrokeWidthChange(2)} className="stroke-option-label" >
          <input  className="stroke-radio" type="radio" />
          Thin
        </label>
        <label onClick={() => onStrokeWidthChange(4)} className="stroke-option-label" >
          <input className="stroke-radio" type="radio" />
          Bold
        </label>
        <label onClick={() => onStrokeWidthChange(6)} className="stroke-option-label" >
          <input className="stroke-radio" type="radio" />
          Thick
        </label>
        {/* Stroke Style */}
        <div className="options-header">Stroke Style</div>
        <label onClick={() => onStrokeStyleChange('solid'/*[]*/)} className="stroke-option-label" >
          <input className="stroke-radio" type="radio" />
          Solid
        </label>
        <label onClick={() => onStrokeStyleChange('dashed'/*[20,15]*/)} className="stroke-option-label" >
          <input className="stroke-radio" type="radio" />
          Dashed
        </label>
        <label onClick={() => onStrokeStyleChange('dotted'/*[tool.lineWidth,10]*/)} className="stroke-option-label" >
          <input className="stroke-radio" type="radio" />
          Dotted
        </label>
      </div>
    </>
  );
};

export default DrawContent;