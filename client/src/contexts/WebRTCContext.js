import React, { useRef } from 'react';

const WebRTCContext = React.createContext();

export const WebRTCProvider = ({ children }) => {
  const gumStreamRef = useRef(null);
  const connections = {}; // socketId -> RTCPeerConnection
  
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

  const openCall = (myPeerConnection, socket, targetSocketId) => {
    navigator.mediaDevices.getUserMedia({ audio: true, video: false })
      .then((stream) => {
        /* use the stream */
        for (const track of stream.getTracks()) {
          myPeerConnection.addTrack(track);
        }

        sendOffer(myPeerConnection, socket, targetSocketId);
      })
      .catch((err) => {
        /* handle the error */
        console.log(err);
      });

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
      console.log('Failed to send offer');
    });
    console.log('sending offer', connections);
  }

  const acceptOffer = (myPeerConnection, description, socket, targetSocketId) => {
    connections[targetSocketId] = myPeerConnection;
    navigator.mediaDevices.getUserMedia({ audio: true, video: false })
      .then((stream) => {
        /* use the stream */
        for (const track of stream.getTracks()) {
          myPeerConnection.addTrack(track);
        }
        myPeerConnection.setRemoteDescription(new RTCSessionDescription(description))
          .then(() => {
            myPeerConnection.createAnswer().then(answer => {
              return myPeerConnection.setLocalDescription(answer);
            })
            .then(() => {
              // Send the answer to the remote peer through the signaling server.
              console.log('a string', myPeerConnection);
              socket.emit('send answer', { sdp: myPeerConnection.localDescription, targetSocketId })
            })
            .catch(err => console.log(err));
          })
          .catch(err => console.log(err));
      })
      .catch((err) => {
        /* handle the error */
        console.log(err);
      });
  }

  const acceptAnswer = (targetSocketId, description) => {
    const myPeerConnection = connections[targetSocketId];
    
    myPeerConnection.setRemoteDescription(description);

    console.log('Accepted Answer', myPeerConnection);
  }

  const addIce = (targetSocketId, ice) => {
    const pc = connections[targetSocketId];
    if (ice) {
      // A typical value of ice here might look something like this:
      //
      // {candidate: "candidate:0 1 UDP 2122154243 192.168.1.9 53421 typ host", sdpMid: "0", ...}
      //
      // Pass the whole thing to addIceCandidate:
      console.log('attempting to add ice', ice);
      pc.addIceCandidate(ice)
        .then(() => console.log('connections', connections))
        .catch(e => {
          console.log("Failure during addIceCandidate(): " + e.name);
        });
    } else {
      // handle other things you might be signaling, like sdp
    }
  }

  return (
    <WebRTCContext.Provider value={{ getMedia, openCall, sendOffer, acceptOffer, acceptAnswer, addIce }}>
      { children }
    </WebRTCContext.Provider>
  )
}

export default WebRTCContext;