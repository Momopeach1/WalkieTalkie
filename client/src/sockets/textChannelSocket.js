const textChannelSocket = (socket, logsContext) => {
  const { setLogs } = logsContext;

  socket.on('new message', data => {

    console.log("new message", data);
    setLogs(prevLogs => {
      return [ ...prevLogs, data ];
    });
    document.querySelector('.logs-container').scrollIntoView(false);
  });

}

export default textChannelSocket;