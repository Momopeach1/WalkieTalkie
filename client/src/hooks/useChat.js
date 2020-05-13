import { useContext, useEffect } from 'react';
import openSocket from 'socket.io-client';
import server from '../apis/server';
import AllUsersContext from '../contexts/AllUsersContext';
import LogsContext from '../contexts/LogsContext';
import SocketContext, { SocketProvider } from '../contexts/SocketContext';
import UserContext from '../contexts/UserContext';
import ChannelContext from '../contexts/ChannelContext';
import WebRTCContext from '../contexts/WebRTCContext';


const useChat = () => {
  const { setSocket } = useContext(SocketContext);
  const { setLogs } = useContext(LogsContext);
  const { user } = useContext(UserContext);
  const { setAllUsers } = useContext(AllUsersContext);
  const { selectedChannel, fetchChannels, setSelectedVoice, selectedVoice } = useContext(ChannelContext);
  const { openCall, sendOffer, acceptOffer, acceptAnswer, addIce } = useContext(WebRTCContext);
  // const config = { "iceServers": [{ "urls": "stun:stun.1.google.com:19302"}] };
  const config = null;
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

      socket.on('joined voice', () =>{
        fetchChannels();
      });

      socket.on('exit voice', data => {
        fetchChannels();
        if (data.leaver === socket.id) setSelectedVoice('');
      });

      socket.on('new talker joined', data => {
        console.log('new talker joined', data.channelName);
        // Caller
        const peerConnection = new RTCPeerConnection(config);
        peerConnection.onicecandidate = event => {
          if (event.candidate) {
            console.log('Sending ice candidate to callee', JSON.stringify({ice: event.candidate}));
            console.log('sending to selectedVoice', data.channelName);
            console.log('new talker joined v2', data.channelName)
            socket.emit('send ice', { ice: JSON.stringify(event.candidate), socketId: data.socketId, channelName: data.channelName });
          } else {
            console.log('All ice candidates have been sent.');
          }
        }
        peerConnection.ontrack = e => {
          if (document.querySelector('audio#local').srcObject !== e.streams[0]) {
            document.querySelector('audio#local').srcObject = e.streams[0];
            console.log('Received remote stream', e.streams);

          }          
        }
        openCall(peerConnection, socket, data.socketId, data.channelName);
      })

      socket.on('request connection', data => {
        // Callee
        console.log('requesting connection');
        const peerConnection = new RTCPeerConnection(config);
        peerConnection.onicecandidate = event => {
          if (event.candidate) {
            console.log('Sending ice candidate to caller', JSON.stringify({ice: event.candidate}))
            console.log('sending to selectedVoice', data.channelName);
            socket.emit('send ice', { ice: JSON.stringify(event.candidate), socketId: data.socketId, channelName: data.channelName });
          } else {
            console.log('All ice candidates have been sent.');
          }
        }
        peerConnection.ontrack = e => {
          console.log('meooooowwwwwwwww') 
          if (document.querySelector('audio#local').srcObject !== e.streams[0]) {
            document.querySelector('audio#local').srcObject = e.streams[0];
            console.log('Received remote stream', e.streams);
          }
        }
        acceptOffer(peerConnection, data.sdp, socket, data.socketId);
      })

      socket.on('send ice', data => {
        console.log('adding ice canditates...', new RTCIceCandidate(JSON.parse(data.ice)));
        addIce(data.socketId, new RTCIceCandidate(JSON.parse(data.ice)));
      })

      
      socket.on('complete connection', data => {
        acceptAnswer(data.socketId, data.sdp);

      })

    }
  },[user])
};

export default useChat;