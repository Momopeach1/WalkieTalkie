import React, { useContext } from 'react';

import UserContext from '../contexts/UserContext';
import ChannelContext from '../contexts/ChannelContext';
import server from '../apis/server';
import SocketContext, { SocketProvider } from '../contexts/SocketContext';

const useUserControl = () => {
  const { user } = useContext(UserContext);
  const { selectedVoice, setSelectedVoice } = useContext(ChannelContext);
  const { socket } = useContext(SocketContext);

  const handleLeaveVoice = () => {
    setSelectedVoice('');
    server.put('/channel/leave-voice', { socketId: socket.id, name: selectedVoice })
    .then(result => {
      //spaghetti we just want to refetch the channels
      socket.emit('joined voice', {});
    })
  }

  const renderConnectionControls = () => {
    return selectedVoice.length > 0 && (
      <div className="render-connection-controls">
        <button onClick={handleLeaveVoice}>leave voice</button>
      </div>
    );
  }

  return [renderConnectionControls];
}

export default useUserControl;