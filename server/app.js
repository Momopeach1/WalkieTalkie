const expressSession = require('express-session');
const mongoose       = require('mongoose');
const express        = require('express');
const http           = require('http');
const path           = require('path');
const app            = express();
const server         = http.Server(app);
const socket         = require('socket.io');
const io             = socket(server);

const passport       = require('./middlewares/authentication');
const User           = require('./models/user');
const Channel        = require('./models/channel');

app.use(express.json());
app.use(expressSession({ secret: process.env.SESSION_SECRET, resave: false, saveUninitialized: true }));
app.use(passport.initialize());
app.use(passport.session());

const mongooseOptions = { 
  useNewUrlParser: true,  
  useUnifiedTopology: true, 
  useCreateIndex: true 
};
mongoose.connect(process.env.MONGO_URI, mongooseOptions);

const PORT = process.env.PORT || 8080;

// Socket.io
io.on('connection', (socket) => {
  console.log('a user connected', socket.id);

  socket.join('General Room');
  
  socket.emit('generated socket id', { socketId: socket.id }, () => io.in('General Room').emit('user joined', {}) );
  
  socket.on('send message', async data => {
    io.in('General Room').emit('new message', { 
      content: data.message.text, 
      createdAt: data.message.timestamp, 
      sender: {
        displayName: data.displayName,
        photoURL: data.photoURL
      },
      channel: { name: data.selectedChannel }
    });
  });

  socket.on('created channel', () => {
    io.in('General Room').emit('created channel', {});
  });

  socket.on('joined voice', data => {
    console.log('joined voice', data.channelName);
    socket.join(data.channelName);
    io.in('General Room').emit('joined voice', {});
    socket.to(data.channelName).emit('new talker joined', { socketId: data.socketId, channelName: data.channelName });
  });

  socket.on('send offer', data => {
    io.to(data.targetSocketId).emit('request connection', { sdp: data.sdp, socketId: socket.id, channelName: data.channelName });
  });

  socket.on('send answer', data => {
    io.to(data.targetSocketId).emit('complete connection', { sdp: data.sdp, socketId: socket.id });
  })

  socket.on('send ice', data => {
    console.log('send ice channel name', data.channelName)
    socket.to(data.channelName).emit('send ice', { socketId: socket.id, ice: data.ice, channelName: data.channelName })
  })

  socket.on('exit voice', data => {
    socket.leave(data.channelName);
    io.in('General Room').emit('exit voice', { leaver: socket.id });
  });

  socket.on('disconnect', () => {
    // leave current voice channel here.
    console.log('a user has disconnected', socket.id);
    User.findOne({ socketId: socket.id }, (error, result) => {
      if (error || !result) return;
      io.in('General Room').emit('user left', result);
      Channel.findOne({ name: result.currentVoiceChannel }, (err, result) => {
        if (!result) return;
        result.talkers.delete(socket.id);
        result.save();
      })

      User.updateOne({ socketId: socket.id }, { socketId: null, currentVoiceChannel: '' }, (err, result) => {

      });
    });
  });
});

// Controller Setup
app.use('/api',require('./controllers'))

// for production use, we serve the static react build folder
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../client/build')));

  // all unknown routes should be handed to our react app
  app.get('*', function (req, res) {
    res.sendFile(path.join(__dirname, '../client/build', 'index.html'));
  });
}

server.listen(PORT,()=>console.log('listening to port:', PORT));
