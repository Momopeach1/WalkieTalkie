const express = require('express');
const http = require('http');
const app = express();
const server = http.Server(app);
const socket = require('socket.io');
const io = socket(server);
const firebase = require('firebase/app');
require('firebase/auth');
require('firebase/firestore');

const PORT = process.env.PORT || 8080;

// Firebase
const firebaseConfig = {
  apiKey           : process.env.API_KEY,
  authDomain       : process.env.AUTH_DOMAIN,
  databaseURL      : process.env.DATABASE_URL,
  projectId        : process.env.PROJECT_ID,
  storageBucket    : process.env.STORAGE_BUCKET,
  messagingSenderId: process.env.MESSAGING_SENDER_ID,
  appId            : process.env.APP_ID,
  measurementId    : process.env.MEASUREMENT_ID
};

firebase.initializeApp(firebaseConfig);

const firestore = firebase.firestore();

// Socket.io
io.on('connection', (socket) => {
  console.log('a user connected');

  socket.join('General Room');

  socket.emit('generated socket id', { socketId: socket.id }, () => io.in('General Room').emit('user joined', {}) );
  
  socket.on('send message',(data)=>{
    io.in('General Room').emit('new message', data);
  });

  socket.on('disconnect', async () => {
    console.log('a user has disconnected', socket.id);
    const socketRef = firestore.collection('sockets').doc(`${socket.id}`);
    const socketDoc = await socketRef.get();
    const socketData = socketDoc.data();

    const userRef = firestore.collection('users').doc(`${socketData.uid}`);
    const userDoc = await userRef.get();
    const { uid, photoURL, email, displayName } = userDoc.data();

    await userRef.set({ uid, photoURL, email, displayName, socketId: null });
    await socketRef.delete();

    io.in('General Room').emit('user left', {});
  });
});

// Controller Setup
app.use('/api',require('./controllers'))

server.listen(PORT,()=>console.log('listening to port:', PORT));

