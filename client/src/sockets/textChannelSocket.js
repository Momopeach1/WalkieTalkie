
const textChannelSocket = (socket, logsContext, channelContext) => {
  const { setLogs } = logsContext;
  const { fetchTextChannels } = channelContext;


  socket.on('new message', data => {

    console.log("new message", data);
    setLogs(prevLogs => {
      return [ ...prevLogs, data ];
    });
    document.querySelector('.logs-container').scrollIntoView(false);
  });

  socket.on('create text channel', () => {
    fetchTextChannels();
  });

}

export default textChannelSocket;