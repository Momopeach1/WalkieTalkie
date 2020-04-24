const expressSession = require('express-session');
const mongoose       = require('mongoose');
const express        = require('express');
const http           = require('http');
const app            = express();
const server         = http.Server(app);
const socket         = require('socket.io');
const io             = socket(server);

const passport       = require('./middlewares/authentication');

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
  console.log('a user connected');

  socket.join('General Room');

  socket.emit('generated socket id', { socketId: socket.id }, () => io.in('General Room').emit('user joined', {}) );
  
  socket.on('send message', async data => {
    io.in('General Room').emit('new message', data);

    // const msgRef = firestore.collection('msg').doc('General Room');
    // const msgDoc = await msgRef.get();
    // msgRef.set({ messages: [...msgDoc.data().messages, data] });
    
  });

  socket.on('disconnect', async () => {
    console.log('a user has disconnected', socket.id);
    // const socketRef = firestore.collection('sockets').doc(`${socket.id}`);
    // const socketDoc = await socketRef.get();
    // const socketData = socketDoc.data();

    // const userRef = firestore.collection('users').doc(`${socketData.uid}`);
    // const userDoc = await userRef.get();
    // const { uid, photoURL, email, displayName } = userDoc.data();

    // await userRef.set({ uid, photoURL, email, displayName, socketId: null });
    // await socketRef.delete();

    io.in('General Room').emit('user left', {});
  });
});

// Controller Setup
app.use('/api',require('./controllers'))

server.listen(PORT,()=>console.log('listening to port:', PORT));

