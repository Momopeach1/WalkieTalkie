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
import ToolKit from '../components/ChatPage/whiteboard/ToolKit';

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
        //channelContext.fetchTextChannels();
        channelContext.fetchVoiceChannels();
        channelContext.fetchWhiteboardChannels();
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

      socket.on('joined whiteboard', data => {
        channelContext.fetchWhiteboardChannels();
        if (channelContext.selectedChannelRef.current.type === 'whiteboard') {
          const container = document.createElement("div");
          container.style.minWidth = '32px';
          container.style.height = '32px';
          container.style.position = 'absolute';
          container.setAttribute('id', `container-${data.socketId}`);
          container.setAttribute('class', 'cursor-container');
          
          const img = document.createElement("IMG");
          img.setAttribute('id', `cursor-${data.socketId}`);
          container.appendChild(img);
          
          const name = document.createElement('div');
          name.setAttribute('id', `name-${data.socketId}`);
          name.style.marginLeft = "25px";
          name.style.color = "white";
          name.style.background = "#8bcd2f";
          name.style.padding = "4px";
          name.style.fontSize = "12px";
          name.style.border = "0.5px solid darkgreen";
          name.style.borderRadius = "3px";          

          container.appendChild(name);

          document.querySelector('body').appendChild(container);
        }
      });

      socket.on('request canvas', data => {
        socket.emit('request canvas', {
          requester: data.requester,
          dataURL: document.querySelector('canvas').toDataURL()
        });
      });

      socket.on('receive canvas', data => {
        const myCanvas = document.querySelector('canvas');
        const ctx = myCanvas.getContext('2d');
        const img = new Image;
        img.onload = function(){
          ctx.drawImage(img,0,0); // Or at whatever offset you like
        };
        img.src = data.dataURL;
      });

      socket.on('moving mouse', data => {
        const canvas = document.querySelector('canvas').getBoundingClientRect();
        const cursor = document.getElementById(`cursor-${data.socketId}`);
        const container = document.getElementById(`container-${data.socketId}`);
        const name = document.getElementById(`name-${data.socketId}`);
        name.innerHTML = data.displayName;
        cursor.setAttribute('src', ToolKit.USER_POINTER);
        // cursor.style.position = "absolute";
        cursor.setAttribute('width', '30px');
        cursor.setAttribute('height', 'auto');
        container.style.top = `${data.y * window.innerHeight - canvas.top - 2}px`;
        container.style.left = `${data.x * window.innerWidth - canvas.left - 6}px`;
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