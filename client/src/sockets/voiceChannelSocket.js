

const voiceChannelSocket = (socket, webRTCContext, channelContext) => {

  const { 
    openCall, 
    acceptOffer,
    acceptAnswer, 
    addIce, 
    getMedia, 
    config, 
    onIceCandidateHandler, 
    onTrackHandler 
  } = webRTCContext;
  const { fetchChannels, setSelectedVoice } = channelContext;


  socket.on('joined voice', () =>{
    fetchChannels();
  });

  socket.on('exit voice', data => {
    fetchChannels();
    if (data.leaver === socket.id) setSelectedVoice('');
  });

  socket.on('new talker joined', data => {
    // Caller
    const peerConnection = new RTCPeerConnection(config);
    peerConnection.onicecandidate = event => onIceCandidateHandler(event, data, () => {
        socket.emit('send ice', { 
          ice: JSON.stringify(event.candidate), 
          socketId: data.socketId, 
          channelName: data.channelName 
        });
    });
    peerConnection.ontrack = e => onTrackHandler(e, data);

    getMedia({ audio: true }, () => openCall(peerConnection, socket, data.socketId, data.channelName))
  })

  socket.on('request connection', data => {
    // Callee
    const peerConnection = new RTCPeerConnection(config);

    peerConnection.onicecandidate = event => onIceCandidateHandler(event, data, () => {
      socket.emit('send ice', { 
        ice: JSON.stringify(event.candidate), 
        socketId: data.socketId, 
        channelName: data.channelName 
      });
  });
    peerConnection.ontrack = e => onTrackHandler(e, data);
    getMedia({ audio: true }, () => acceptOffer(peerConnection, data.sdp, socket, data.socketId));
  })

  socket.on('send ice', data => {
    console.log('adding ice canditates...', new RTCIceCandidate(JSON.parse(data.ice)));
    addIce(data.socketId, new RTCIceCandidate(JSON.parse(data.ice)));
  })

  
  socket.on('complete connection', data => {
    acceptAnswer(data.socketId, data.sdp);
  })

}

export default voiceChannelSocket;