import React from 'react';
import { Route, Router, Switch } from 'react-router-dom';
import { UserProvider } from '../contexts/UserContext';
import { SocketProvider } from '../contexts/SocketContext';
import { LogsProvider } from '../contexts/LogsContext';
import { AllUsersProvider } from '../contexts/AllUsersContext';
import '../styles/App.css';
import history from '../utilities/history';
import ChatPage from "./ChatPage/ChatPage";
import ProtectedRoute from './hocs/ProtectedRoute';
import HomePage from './HomePage';
import ProfilePage from './ProfilePage';
import SigninPage from "./SigninPage";
import SignOutPage from "./SignoutPage";
import SignupPage from "./SignupPage";
import useApp from '../hooks/useApp';

const App = () => {
  useApp();

  return (
    <Router history={history}>
      <Switch>
        <Route path="/signin" component={SigninPage} />
        <Route path="/signup" component={SignupPage}/>
        <Route path ="/profile" component={ProfilePage} />
        <Route path="/chat" component={ChatPage} />
        <Route path="/" component={HomePage} />
        <Route path="/signout" component={SignOutPage} />
      </Switch>
    </Router>
  );
}

export default () => (
  <AllUsersProvider>
    <LogsProvider>
      <SocketProvider>
        <UserProvider>
          <App />
        </UserProvider>
      </SocketProvider>
    </LogsProvider>
  </AllUsersProvider>
);

