import React, { useContext, useState } from 'react';
import SocketContext from '../../../../contexts/SocketContext';
import ChannelContext from '../../../../contexts/ChannelContext';
import WhiteboardContext from '../../../../contexts/WhiteboardContext';
import ToolKit from '../ToolKit';
import SysTool from '../SysTool';
import HexInput from '../HexInput';

const MiscContent = () => {
  const { socket } = useContext(SocketContext);
  const { selectedChannel } = useContext(ChannelContext);
  const [hexError, setHexError] = useState(false);
  const { bgColor, setBgColor } = useContext(WhiteboardContext);

  const handleOnClear = () =>{
    if(window.confirm('This will clear the whole canvas. Are you sure?'))
      socket.emit('clear canvas', {channelName: selectedChannel.name});
  }
  const handleOnSubmit = (e, color) => {
    e.preventDefault();
    if (!/^#[0-9A-F]{6}$/i.test('#' + color)) return setHexError(true);
    if (window.confirm('This will clear the whole canvas. Are you sure?')) {
      setHexError(false);
      setBgColor(color);
      const canvas = document.querySelector('canvas');
      const context = canvas.getContext('2d');
      const canvasRect = canvas.getBoundingClientRect();
      context.clearRect(0, 0, canvasRect.width, canvasRect.height);
      document.querySelector('canvas').style.background = '#' + color;       
    }
  };

  return (
    <>
      <div className="row">
        <div className="col-12">
          <div className="systool-container">
            <SysTool name="systool" id="island-delete" handleOnClick={handleOnClear}>{ToolKit.DELETE}</SysTool>
            <SysTool name="systool" id="island-save">{ToolKit.SAVE}</SysTool>
          </div>
        </div>
      </div>
      <div className="row">
        <div className="col-12">
          <form onSubmit={e => handleOnSubmit(e, bgColor)}>
            <HexInput
              id="bgcolor"
              className="hex-color-input"
              error={hexError}
              value={bgColor}
              autoComplete="off"
              variant="outlined"
              handleOnColorClick={handleOnSubmit}
              helperText={hexError ? 'Must be valid hex.' : ''}
              colors={
                ['#ffffff', '#fff4e6', '#fff9db',
                  '#f4fce3', '#ebfbee', '#e6fcf5',
                  '#edf2ff', '#f8f0fc', '#e3fafc'
                ]
              }
              onChange={e => setBgColor(e.target.value)}
            />
          </form>
        </div>
      </div>
    </>
  )
}

export default MiscContent;