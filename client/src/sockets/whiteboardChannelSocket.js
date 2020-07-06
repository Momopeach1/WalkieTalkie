import ToolKit from '../components/ChatPage/whiteboard/ToolKit';

const whiteboardChannelSocket = (socket, channelContext, whiteboardContext) => {

  const { appendCursor, draw } = whiteboardContext;
  const { fetchWhiteboardChannels, selectedChannelRef } = channelContext;


  socket.on('drawing path', data => {
    const { x0, x1, y0, y1, lineWidth, color } = data;
    draw(x0, y0, x1, y1, lineWidth, color, false, null);
  });

  socket.on('joined whiteboard', data => {
    fetchWhiteboardChannels();
    if (selectedChannelRef.current.type === 'whiteboard' && data.socketId !== socket.id)
      appendCursor(data);
  });

  socket.on('leave whiteboard', data => {
    fetchWhiteboardChannels();
    const cursor = document.querySelector(`#container-${data.socketId}`); 
    if (cursor) cursor.remove();
  });

  socket.on('request canvas', data => {
    socket.emit('request canvas', {
      requester: data.requester,
      dataURL: document.querySelector('canvas').toDataURL()
    });
  });

  socket.on('receive canvas', data => {
    const canvas = document.querySelector('canvas');
    const context = canvas.getContext('2d');
    const dataURL = data.dataURL;
    const img = new Image();

    img.onload = () => {
      canvas.style.width = img.width;
      canvas.style.height = img.height;
      canvas.width = img.width;
      canvas.height = img.height;
      context.drawImage(img, 0, 0);
    }
    img.src = dataURL;        
  });

  socket.on('moving mouse', data => {
    const cursor = document.getElementById(`cursor-${data.socketId}`);
    const container = document.getElementById(`container-${data.socketId}`);
    const name = document.getElementById(`name-${data.socketId}`);
    name.innerHTML = data.displayName;
    cursor.setAttribute('src', ToolKit.USER_POINTER);
    cursor.setAttribute('width', '30px');
    cursor.setAttribute('height', 'auto');
    container.style.top = `${data.y}px`;
    container.style.left = `${data.x}px`;
  });

  socket.on('clear canvas', () => {
    const canvas = document.querySelector('canvas').getBoundingClientRect();
    const context = document.querySelector('canvas').getContext('2d');
    context.clearRect(0,0,canvas.width, canvas.height);
  });
}

export default whiteboardChannelSocket;