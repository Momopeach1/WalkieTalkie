
const textChannelSocket = (socket, logsContext, channelContext) => {
  const { setLogs, fetchMessages, messageMapRef } = logsContext;
  const { fetchTextChannels } = channelContext;


  socket.on('new message', data => {

    console.log("new message", data);
    messageMapRef.current = {...messageMapRef.current, [data.channel._id]: [...messageMapRef.current[data.channel._id], data]}
    console.log(messageMapRef.current);

    setLogs(messageMapRef.current[data.channel._id]);

    // document.querySelector('.log-container').scrollIntoView(false);
    if(document.querySelector('.log-container')){
      document.querySelector('.log-container').scrollTop = document.querySelector('.log-container').scrollHeight;
    } 
  });

  socket.on('create text channel', () => {
    fetchTextChannels(fetchMessages);
  });

}

export default textChannelSocket;