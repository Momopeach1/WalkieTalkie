
const textChannelSocket = (socket, logsContext, channelContext) => {
  const { setLogs } = logsContext;
  const { fetchTextChannels } = channelContext;


  socket.on('new message', data => {

    console.log("new message", data);
    setLogs(prevLogs => {
      return [ ...prevLogs, data ];
    });
    // document.querySelector('.log-container').scrollIntoView(false);
    if(document.querySelector('.log-container')){
      document.querySelector('.log-container').scrollTop = document.querySelector('.log-container').scrollHeight;
    } 
  });

  socket.on('create text channel', () => {
    fetchTextChannels();
  });

}

export default textChannelSocket;