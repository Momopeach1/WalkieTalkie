import { useContext, useEffect } from 'react';
import openSocket from 'socket.io-client';

import server from '../apis/server';
import UserContext from '../contexts/UserContext';
import AllUsersContext from '../contexts/AllUsersContext';
import SocketContext from '../contexts/SocketContext';
import LogsContext from '../contexts/LogsContext';

const useChat = () => {
  const { setSocket } = useContext(SocketContext);
  const { setLogs } = useContext(LogsContext);
  const { user } = useContext(UserContext);
  const { setAllUsers } = useContext(AllUsersContext);

  const fetchAllUsers = async () => {
    const response = await server.get('/user');
    setAllUsers(response.data);
  }

  useEffect(() => {
    const socket = openSocket();
    setSocket(socket);

    socket.on('generated socket id', async ({ socketId }, announceJoin) => {
      await server.put('/user', { email: user.email, socketId: socketId });
      announceJoin();
      
      // firestore.collection('msg').doc('General Room').get()
      //   .then(snapshot => setLogs(snapshot.data().messages));

    });

    socket.on('new message', data => {
      setLogs(prevLogs => [ ...prevLogs, data ]);
      document.querySelector('.logs-container').scrollIntoView(false);
    });

    socket.on('user left', () => {
      console.log('user right');
      fetchAllUsers();
    })

    socket.on('user joined', ()=> {
      console.log('fetching');
      fetchAllUsers();
    });
  },[])
};

export default useChat;