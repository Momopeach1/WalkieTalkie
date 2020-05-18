import { useContext } from 'react';

import server from '../apis/server';
import history from '../utilities/history';
import UserContext from '../contexts/UserContext';
import SocketContext from '../contexts/SocketContext';
import WebRTCContext from '../contexts/WebRTCContext';

const useSettings = () => {
  const { setIsAuth, setUser } = useContext(UserContext);
  const { socket } = useContext(SocketContext);
  const { leaveVoice } = useContext(WebRTCContext);

  const handleOnSignout = () => {
    server.post('/user/signout')
      .then(() => {
        setIsAuth(false);
        setUser({ 
          email: null, 
          displayName: null,
          socketId: null,
          photoURL: null,
        });
        history.push('/');
        leaveVoice();
        socket.disconnect();
      });
  };

  return [handleOnSignout];
};

export default useSettings;
