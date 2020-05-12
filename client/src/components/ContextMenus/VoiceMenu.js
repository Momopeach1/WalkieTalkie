import React, { useContext } from 'react';

import { MenuItem } from 'react-contextmenu';
import server from '../../apis/server';
import SocketContext from '../../contexts/SocketContext';

const VoiceMenu = () => {
  const { socket } = useContext(SocketContext);

  function handleClick(e, data) {
    server.put('/channel/kick', { socketId: data.talker.socketId, email: data.talker.email, name: data.talker.currentVoiceChannel })
      .then(() => socket.emit('exit voice', {}))
      .catch(error => console.log(error));
  }

  return (
    <>
      <MenuItem data={{foo: 'bar'}} onClick={handleClick}>
        Kick
      </MenuItem>
      <MenuItem divider />
      <MenuItem data={{foo: 'bar'}} onClick={handleClick}>
        ContextMenu Item 3
      </MenuItem>
    </>
  );
}

export default VoiceMenu;

