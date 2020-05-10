const expressSession = require('express-session');
const mongoose       = require('mongoose');
const express        = require('express');
const http           = require('http');
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

  socket.on('joined voice', () => {
    io.in('General Room').emit('joined voice', {});
  });

  socket.on('exit voice', () => {
    io.in('General Room').emit('exit voice', {});
  });

  socket.on('disconnect', async () => {
    console.log('a user has disconnected', socket.id);
    User.findOne({ socketId: socket.id }, (error, result) => {
      if (error || !result) return;
      io.in('General Room').emit('user left', result);
      console.log('user left', result);
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

server.listen(PORT,()=>console.log('listening to port:', PORT));

