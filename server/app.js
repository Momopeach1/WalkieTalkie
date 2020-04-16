const express = require('express');
const http = require('http');
const app = express();
const server = http.Server(app);
const socket = require('socket.io');
const io = socket(server);

const PORT = process.env.PORT || 8080;

server.listen(PORT,()=>console.log('listening to port:', PORT));

io.on('connection', (socket) => {
  console.log('a user connected');
  socket.on('send',(data)=>{
    console.log(data);
  });
});
io.listen(8000);
app.use('/api',require('./controllers'))

