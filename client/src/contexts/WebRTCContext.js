import React, { useRef } from 'react';

const WebRTCContext = React.createContext();

export const WebRTCProvider = ({ children }) => {
  let myStream = null;
  let connections = {}; // socketId -> RTCPeerConnection
  
  const getMedia = (constraints, callback) => {
    console.log('inside of promise')
    navigator.mediaDevices.getUserMedia(constraints)
      .then((stream) => {
        /* use the stream */
        console.log('stream', stream);
        myStream = stream;
        callback();
      })
      .catch((err) => {
        /* handle the error */
        console.log('failed to get media', err);
      });
  }

  const openCall = (myPeerConnection, socket, targetSocketId, channelName) => {

    /* use the stream */
    for (const track of myStream.getTracks()) {
      myPeerConnection.addTrack(track, myStream);
    }

    sendOffer(myPeerConnection, socket, targetSocketId, channelName);

    console.log('opening call...');
  }
  
  const sendOffer = (myPeerConnection, socket, targetSocketId, channelName) => {
    console.log('send offer', channelName);
    connections[targetSocketId] = myPeerConnection;
    myPeerConnection.createOffer({   offerToReceiveAudio: 1,
      offerToReceiveVideo: 0,
      voiceActivityDetection: false })
      .then(offer => myPeerConnection.setLocalDescription(new RTCSessionDescription(offer)))
      .then(() => {
        socket.emit('send offer', { sdp: myPeerConnection.localDescription, targetSocketId, channelName })
      })
      .catch(function(reason) {
        // An error occurred, so handle the failure to connect
        console.log('Failed to send offer');
      });
  }

  const acceptOffer = (myPeerConnection, description, socket, targetSocketId) => {
    connections[targetSocketId] = myPeerConnection;
    console.log("accepting offer pc is", connections[targetSocketId])
    // navigator.mediaDevices.getUserMedia({ audio: true })
    //   .then((stream) => {
        /* use the stream */
        for (const track of myStream.getTracks()) {
          myPeerConnection.addTrack(track, myStream);
        }
        myPeerConnection.setRemoteDescription(new RTCSessionDescription(description))
          .then(() => {
            myPeerConnection.createAnswer().then(answer => {
              return myPeerConnection.setLocalDescription(new RTCSessionDescription(answer));
            })
            .then(() => {
              // Send the answer to the remote peer through the signaling server.
              console.log('a string', myPeerConnection);
              socket.emit('send answer', { sdp: myPeerConnection.localDescription, targetSocketId })
            })
            .catch(err => console.log(err));
          })
          .catch(err => console.log(err));
      // })
      // .catch((err) => {
        /* handle the error */
      //   console.log(err);
      // });
  }

  const acceptAnswer = (targetSocketId, description) => {
    const myPeerConnection = connections[targetSocketId];
    
    myPeerConnection.setRemoteDescription(new RTCSessionDescription(description));

    console.log('Accepted Answer', myPeerConnection);
  }

  const addIce = (targetSocketId, ice) => {
    const pc = connections[targetSocketId];
    if (ice && pc) {
      // A typical value of ice here might look something like this:
      //
      // {candidate: "candidate:0 1 UDP 2122154243 192.168.1.9 53421 typ host", sdpMid: "0", ...}
      //
      // Pass the whole thing to addIceCandidate:
      console.log("all connections", connections);
      console.log("length of connection", Object.keys(connections).length);
      console.log("target socket id", typeof targetSocketId);
      console.log("contains", connections.hasOwnProperty(targetSocketId))
      console.log("pc", connections[targetSocketId]);
      pc.addIceCandidate(ice)
        .then(() => {
          console.log('connections', connections)
        })
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