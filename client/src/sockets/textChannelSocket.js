const textChannelSocket = (socket, logsContext) => {
  const { setLogs } = logsContext;

  socket.on('new message', data => {
    setLogs(prevLogs => [ ...prevLogs, data ]);
    document.querySelector('.logs-container').scrollIntoView(false);
  });

}

export default textChannelSocket;