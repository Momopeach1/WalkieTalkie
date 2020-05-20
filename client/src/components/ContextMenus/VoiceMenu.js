import React, { useContext, useRef, useState } from 'react';
import Checkbox from '@material-ui/core/Checkbox';
import FormControlLabel from '@material-ui/core/FormControlLabel';

import { MenuItem } from 'react-contextmenu';
import server from '../../apis/server';
import SocketContext from '../../contexts/SocketContext';
import UserContext from '../../contexts/UserContext';

const VoiceMenu = () => {
  const { socket } = useContext(SocketContext);
  const { user } = useContext(UserContext);
  const [muted, setMuted] = useState(false);

  const MuteMenuItemRef = useRef(null);

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
      <MenuItem 
        preventClose
        ref={MuteMenuItemRef} 
        onClick={(e, d) => { 
          document.getElementById(d.talker.socketId).muted = !document.getElementById(d.talker.socketId).muted;
          setMuted(prevMuted => !prevMuted);
        }} >
        <FormControlLabel 
          control= {
            <Checkbox
              checked={muted}
              onChange={e => {
                MuteMenuItemRef.current.props.onClick();
              }}
            />
          }
          labelPlacement="start"
          label="Mute"
        />
      </MenuItem>
    </>
  );
}

export default VoiceMenu;

