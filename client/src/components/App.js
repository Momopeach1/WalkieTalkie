import React from 'react';
import '../styles/App.css';
import HomePage from './HomePage';
import UserProvider from './providers/UserProvider';

function App() {
  return (
    <UserProvider>
      <HomePage/>
    </UserProvider>
  );
}

export default App;
