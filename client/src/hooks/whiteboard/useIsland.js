import { useContext } from "react";
import SocketContext from "../../contexts/SocketContext";
import ChannelContext from "../../contexts/ChannelContext";


const useIsland = () => {

  const { socket } = useContext(SocketContext);
  const { selectedChannel } = useContext(ChannelContext);

  const handleOnClear = () =>{
    if(window.confirm('This will clear the whole canvas. Are you sure?'))
      socket.emit('clear canvas', {channelName: selectedChannel.name});
  }

  return [handleOnClear];

}

export default useIsland;