import { useContext, useEffect } from 'react';
import openSocket from 'socket.io-client';

import UserContext from '../contexts/UserContext';
import AllUsersContext from '../contexts/AllUsersContext';
import SocketContext from '../contexts/SocketContext';
import LogsContext from '../contexts/LogsContext';
import { generateUserDocument } from '../firebase';
import { firestore } from '../firebase';
import useLogs from './useLogs';

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

    socket.on('generated socket id', ({ socketId}, announceJoin) => {
      console.log(announceJoin);
      generateUserDocument(user, { socketId });
      
      firestore.collection('sockets').doc(`${socketId}`).set({ uid: user.uid })
      .then(() => announceJoin() );
      
      firestore.collection('msg').doc('General Room').get()
        .then(snapshot => setLogs(snapshot.data().messages));

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