import React, { useContext, useEffect } from 'react';
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

import WhiteBoard from '../components/ChatPage/whiteboard/WhiteBoard';
import Chat from '../components/ChatPage/chat/Chat';
import WhiteboardContext from '../contexts/WhiteboardContext';

const useChat = () => {
  const { setSocket } = useContext(SocketContext);
  const { user, isAuth } = useContext(UserContext);
  const logsContext = useContext(LogsContext);
  const allUsersContext = useContext(AllUsersContext);
  const channelContext = useContext(ChannelContext);
  const webRTCContext = useContext(WebRTCContext);
  const whiteboardContext = useContext(WhiteboardContext);
  
  useEffect(() => {
    logsContext.fetchMessages();
  }, [channelContext.selectedChannel.name])
  
  useEffect(() => {
    if (user.email !== null) {
      const socket = openSocket();
      setSocket(socket);
      logsContext.fetchMessages();
      channelContext.fetchTextChannels();
      channelContext.fetchVoiceChannels();
      channelContext.fetchWhiteboardChannels();
  
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

      //WHITE BOARD SOCKET

      socket.on('drawing path', data => {
        const { x0, x1, y0, y1, color } = data;
        const canvas = document.querySelector('canvas').getBoundingClientRect();

        whiteboardContext.draw(
          x0 * window.innerWidth - canvas.left,
          y0 * window.innerHeight - canvas.top,
          x1 * window.innerWidth - canvas.left,
          y1 * window.innerHeight - canvas.top,
          color,
          false,
          null
        )
      });

      socket.on('joined whiteboard', () => {
        server.get('/whiteboard')
          .then(response => whiteboardContext.setWhiteboards(response.data))
          .catch(error => console.log(error));
      });
    }
  },[isAuth]);
  
  const renderMain = () => {
    switch (channelContext.selectedChannel.type) {
      case 'text':
        return <Chat />
      case 'whiteboard':
        return <WhiteBoard />
    }
  }

  return [renderMain];
};

export default useChat;