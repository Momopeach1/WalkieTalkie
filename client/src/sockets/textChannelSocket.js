
const textChannelSocket = (socket, logsContext, channelContext) => {
  const { setLogs, messageMapRef, fetchMessages } = logsContext;
  const { fetchTextChannels } = channelContext;

  socket.on('new message', data => {
    messageMapRef.current = {...messageMapRef.current, [data.channel._id]: [...messageMapRef.current[data.channel._id], data]}
    setLogs(messageMapRef.current[data.channel._id]);
    // document.querySelector('.log-container').scrollIntoView(false);
    if(document.querySelector('.log-container')){
      document.querySelector('.log-container').scrollTop = document.querySelector('.log-container').scrollHeight;
    } 
  });

  socket.on('create text channel', data => {
    fetchTextChannels(fetchMessages);
    messageMapRef.current = {...messageMapRef.current, [data._id]: []};
  });

  socket.on('delete text channel', data => {
    delete messageMapRef.current[data._id];
    fetchTextChannels(fetchMessages)
  });

}

export default textChannelSocket;