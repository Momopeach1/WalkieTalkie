import { useContext, useState } from "react";
import SocketContext from "../../contexts/SocketContext";
import ChannelContext from "../../contexts/ChannelContext";
import WhiteboardContext from '../../contexts/WhiteboardContext';


const useIsland = () => {

  const { socket } = useContext(SocketContext);
  const { selectedChannel } = useContext(ChannelContext);
  const { bgColor, setBgColor } = useContext(WhiteboardContext);
  const [hexError, setHexError] = useState(false);

  const handleOnClear = () =>{
    if(window.confirm('This will clear the whole canvas. Are you sure?'))
      socket.emit('clear canvas', {channelName: selectedChannel.name});
  }
  const handleOnSubmit = e => {
    e.preventDefault();
    if (!/^#[0-9A-F]{6}$/i.test(bgColor)) return setHexError(true);
    if (window.confirm('OwO?')) {
      setHexError(false);
      const canvas = document.querySelector('canvas');
      const context = canvas.getContext('2d');
      const canvasRect = canvas.getBoundingClientRect();
      context.clearRect(0, 0, canvasRect.width, canvasRect.height);
      document.querySelector('canvas').style.background = bgColor;       
    }
  }

  return [handleOnClear, handleOnSubmit, hexError];

}

export default useIsland;