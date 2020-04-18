import { useContext, useEffect } from 'react';
import openSocket from 'socket.io-client';

import SocketContext from '../contexts/SocketContext';
import LogsContext from '../contexts/LogsContext';

const useChat = () => {
  const { setSocket } = useContext(SocketContext);
  const { setLogs } = useContext(LogsContext);

  useEffect(()=>{
    const socket = openSocket();
    setSocket(socket);

    socket.on('new message', data => {
      setLogs(prevLogs => [ ...prevLogs, data ]);
      document.querySelector('.logs-container').scrollIntoView(false);
    });
  },[])
};

export default useChat;