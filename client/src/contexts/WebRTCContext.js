import React, { useRef } from 'react';

const WebRTCContext = React.createContext();

export const WebRTCProvider = ({ children }) => {
  const gumStreamRef = useRef(null);
  const connections = {}; // socketId -> RTCPeerConnection
  console.log(connections);
  const getMedia = (constraints) => {
    navigator.mediaDevices.getUserMedia(constraints)
      .then((stream) => {
        /* use the stream */
        gumStreamRef.current = stream;
      })
      .catch((err) => {
        /* handle the error */
      });
  }

  const openCall = myPeerConnection => {
    for (const track of gumStreamRef.current.getTracks()) {
      myPeerConnection.addTrack(track);
    }
    console.log('opening call...');
  }
  
  const sendOffer = (myPeerConnection, socket, targetSocketId) => {
    connections[targetSocketId] = myPeerConnection;
    myPeerConnection.createOffer()
    .then(offer => myPeerConnection.setLocalDescription(offer))
    .then(() => {
      socket.emit('send offer', { sdp: myPeerConnection.localDescription, targetSocketId })
    })
    .catch(function(reason) {
      // An error occurred, so handle the failure to connect
    });
    console.log('sending offer', connections);
  }

  const acceptOffer = (myPeerConnection, description, socket, targetSocketId) => {
    myPeerConnection.setRemoteDescription(new RTCSessionDescription(description))
      .then(() => {
        myPeerConnection.createAnswer().then(answer => {
          return myPeerConnection.setLocalDescription(answer);
        })
        .then(() => {
          // Send the answer to the remote peer through the signaling server.
          socket.emit('send answer', { sdp: myPeerConnection.localDescription, targetSocketId })
        })
        .catch(err => console.log(err));
      })
      .catch(err => console.log(err));
  }

  const acceptAnswer = (targetSocketId, description) => {
    const myPeerConnection = connections[targetSocketId];
    
    myPeerConnection.setRemoteDescription(description);

    console.log('Accepted Answer');
  }

  return (
    <WebRTCContext.Provider value={{ getMedia, openCall, sendOffer, acceptOffer, acceptAnswer }}>
      { children }
    </WebRTCContext.Provider>
  )
}

export default WebRTCContext;