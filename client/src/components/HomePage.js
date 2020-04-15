import React from "react";
import { BrowserRouter as Router, Route } from 'react-router-dom';
import PasswordReset from "./account/PasswordReset";
import SignIn from "./account/SignIn";
import SignUp from "./account/SignUp";
import ChatPage from "./ChatPage";

function HomePage() {
  const user = null;
  return (
        user ?
        <Route />
      :
        <Router>
          <Route path="/SignUp" component={SignUp} />
          <Route path="/SignIn" component={SignIn} />
          <Route path = "/passwordReset" component={PasswordReset} />
          <Route path="/chat" component={ChatPage} />
        </Router>

  );
}
export default HomePage;