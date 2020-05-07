import { useContext, useEffect } from 'react';
import openSocket from 'socket.io-client';
import server from '../apis/server';
import AllUsersContext from '../contexts/AllUsersContext';
import LogsContext from '../contexts/LogsContext';
import SocketContext from '../contexts/SocketContext';
import UserContext from '../contexts/UserContext';
import ChannelContext from '../contexts/ChannelContext';


const useChat = () => {
  const { setSocket } = useContext(SocketContext);
  const { setLogs } = useContext(LogsContext);
  const { user } = useContext(UserContext);
  const { setAllUsers } = useContext(AllUsersContext);
  const { selectedChannel, fetchChannels } = useContext(ChannelContext);

  const fetchAllUsers = async () => {
    const response = await server.get('/user');
    setAllUsers(response.data);
  }

  const fetchMessages = async () => {
    const response = await server.get('/message');
    setLogs(response.data);
  }

  useEffect(() => {
    fetchMessages();
  }, [selectedChannel])

  useEffect(() => {
    if (user.email !== null) {
      const socket = openSocket();
      setSocket(socket);
      fetchMessages();
  
      socket.on('generated socket id', async ({ socketId }, announceJoin) => {
        console.log(socketId, user.email);
        await server.put('/user', { email: user.email, socketId: socketId });
        announceJoin();
      });
  
      socket.on('new message', data => {
        setLogs(prevLogs => [ ...prevLogs, data ]);
        document.querySelector('.logs-container').scrollIntoView(false);
      });
  
      socket.on('created channel', () => {
        fetchChannels();
      })
  
      socket.on('user left', () => {
        fetchAllUsers();
      })
  
      socket.on('user joined', ()=> {
        fetchAllUsers();
      });
    }
  },[user])
};

export default useChat;