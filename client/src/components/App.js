import React from 'react';
import { Route, Router, Switch } from 'react-router-dom';

import HomePage from './HomePage';
import ProfilePage from './ProfilePage';
import SigninPage from "./SigninPage";
import ChatPage from "./ChatPage";

import { UserProvider } from './contexts/UserContext';

import ProtectedRoute from './hocs/ProtectedRoute';
import history from '../utilities/history';
import '../styles/App.css';

const App = () => {
  return (
    <Router history={history}>
      <Switch>
        <Route path="/signin" component={SigninPage} />
        <ProtectedRoute path ="/profile" component={ProfilePage} />
        <Route path="/chat" component={ChatPage} />
        <Route path="/" component={HomePage} />
      </Switch>
    </Router>
  );
}

export default () => (
  <UserProvider>
    <App />
  </UserProvider>
);

