import React, { useContext } from 'react';

import { MenuItem } from 'react-contextmenu';
import server from '../../apis/server';
import SocketContext from '../../contexts/SocketContext';
import UserContext from '../../contexts/UserContext';

const VoiceMenu = () => {
  const { socket } = useContext(SocketContext);
  const { user } = useContext(UserContext);

  function handleClick(e, data) {
    server.put('/channel/kick', { socketId: data.talker.socketId, email: data.talker.email, name: data.talker.currentVoiceChannel })
      .then(() => socket.emit('kick', {socketId: data.talker.socketId, channelName: data.talker.currentVoiceChannel }))
      .catch(error => console.log(error));
  }

  const kickOption = () => user.role === 'Admin' && ( // and user.name !== my name?
    <MenuItem onClick={handleClick}>
      Kick
    </MenuItem>
  )

  return (
    <>
      {kickOption()}
      <MenuItem divider />
      <MenuItem>
        <div></div>
      </MenuItem>
    </>
  );
}

export default VoiceMenu;

