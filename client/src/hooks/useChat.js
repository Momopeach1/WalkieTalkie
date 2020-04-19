import { useContext, useEffect } from 'react';
import openSocket from 'socket.io-client';

import UserContext from '../contexts/UserContext';
import AllUsersContext from '../contexts/AllUsersContext';
import SocketContext from '../contexts/SocketContext';
import LogsContext from '../contexts/LogsContext';
import { generateUserDocument } from '../firebase';
import { firestore } from '../firebase';

const useChat = () => {
  const { setSocket } = useContext(SocketContext);
  const { setLogs } = useContext(LogsContext);
  const { user } = useContext(UserContext);
  const { setAllUsers } = useContext(AllUsersContext);

  const fetchAllUsers = async () => {
    const snapshot = await firestore.collection('users').get();
    const AllUsersData = snapshot.docs.map(doc => doc.data());
    setAllUsers(AllUsersData);
    
  }

  useEffect(() => {
    const socket = openSocket();
    setSocket(socket);

    // window.addEventListener("beforeunload", () => {
    //   socket.emit('user left', {});
    // });

    socket.on('generated socket id', ({ socketId }) => {
      generateUserDocument(user, { socketId });
      firestore.collection('sockets').doc(`${socketId}`).set({ uid: user.uid });
      fetchAllUsers();
    });

    socket.on('new message', data => {
      setLogs(prevLogs => [ ...prevLogs, data ]);
      document.querySelector('.logs-container').scrollIntoView(false);
    });

    socket.on('user left', () => {
      fetchAllUsers();
    })
  },[])
};

export default useChat;