import { useContext, useEffect } from 'react';
import openSocket from 'socket.io-client';

import server from '../apis/server';
import AllUsersContext from '../contexts/AllUsersContext';
import LogsContext from '../contexts/LogsContext';
import SocketContext, { SocketProvider } from '../contexts/SocketContext';
import UserContext from '../contexts/UserContext';
import ChannelContext from '../contexts/ChannelContext';
import WebRTCContext from '../contexts/WebRTCContext';

//Socket 
import textChannelSocket from '../sockets/textChannelSocket';
import voiceChannelSocket from '../sockets/voiceChannelSocket';


const useChat = () => {
  const { setSocket } = useContext(SocketContext);
  const { user, isAuth } = useContext(UserContext);
  const logsContext = useContext(LogsContext);
  const allUsersContext = useContext(AllUsersContext);
  const channelContext = useContext(ChannelContext);
  const webRTCContext = useContext(WebRTCContext);
  
  useEffect(() => {
    logsContext.fetchMessages();
  }, [channelContext.selectedChannel])
  
  useEffect(() => {
    if (user.email !== null) {
      const socket = openSocket();
      setSocket(socket);
      logsContext.fetchMessages();
      channelContext.fetchTextChannels();
      channelContext.fetchVoiceChannels();
  
      socket.on('generated socket id', async ({ socketId }, announceJoin) => {
        await server.put('/user', { email: user.email, socketId: socketId });
        announceJoin();
      });
  
      // (socket, { setLogs }) -> func.setLogs(ksnkjlnfdksnf)
      textChannelSocket(socket, logsContext, channelContext) 
      voiceChannelSocket(socket, webRTCContext, channelContext);
  
      socket.on('user left', () => {
        allUsersContext.fetchAllUsers();
        // channelContext.fetchChannels();
        channelContext.fetchTextChannels();
        channelContext.fetchVoiceChannels();
      });
  
      socket.on('user joined', ()=> {
        allUsersContext.fetchAllUsers();
      });

      socket.on('refresh users', () => {
        console.log('received refresh users');
        allUsersContext.fetchAllUsers();
        logsContext.fetchMessages();
      });
    }
  },[isAuth])
};

export default useChat;