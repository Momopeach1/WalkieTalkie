import React from 'react';
import { Route, Router } from 'react-router-dom';
import History from '../history';
import '../styles/App.css';
import PasswordReset from "./account/PasswordReset";
import ProfilePage from './account/ProfilePage';
import SignIn from "./account/SignIn";
import SignUp from "./account/SignUp";
import ChatPage from "./ChatPage";
import ProtectedRoute from './hocs/ProtectedRoute';
import UserProvider from './providers/UserProvider';

function App() {
  return (
    <UserProvider>
    <Router history={History}>
      <Route path="/SignUp" component={SignUp} />
      <Route path="/SignIn" component={SignIn} />
      <Route path = "/passwordReset" component={PasswordReset} />
      <ProtectedRoute path ="/ProfilePage" component={ProfilePage}/>
      <Route path="/chat" component={ChatPage} />
    </Router>
    </UserProvider>

  );
}

export default App;

