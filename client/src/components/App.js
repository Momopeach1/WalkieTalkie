import firebase from 'firebase/app';
import React, { useContext, useEffect } from 'react';
import { Route, Router, Switch } from 'react-router-dom';
import UserContext, { UserProvider } from '../contexts/UserContext';
import { generateUserDocument } from '../firebase';
import '../styles/App.css';
import history from '../utilities/history';
import ChatPage from "./ChatPage";
import ProtectedRoute from './hocs/ProtectedRoute';
import HomePage from './HomePage';
import ProfilePage from './ProfilePage';
import SigninPage from "./SigninPage";
import SignOutPage from "./SignoutPage";
import SignupPage from "./SignupPage";





const App = () => {
  const {setUser} = useContext(UserContext);
  useEffect(()=>{
    firebase.auth().onAuthStateChanged(async function(user) {
      const response = await generateUserDocument(user);
      console.log(response);
      setUser(response);
    });
  },[])
  return (
    <Router history={history}>
      <Switch>
        <Route path="/signin" component={SigninPage} />
        <Route path="/signup" component={SignupPage}/>
        <ProtectedRoute path ="/profile" component={ProfilePage} />
        <ProtectedRoute path="/chat" component={ChatPage} />
        <Route path="/" component={HomePage} />
        <ProtectedRoute path="/signout" component={SignOutPage} />
      </Switch>
    </Router>
  );
}

export default () => (
  <UserProvider>
    <App />
  </UserProvider>
);

