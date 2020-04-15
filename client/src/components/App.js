import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import '../styles/App.css';
import ChatPage from './ChatPage';
import HomePage from './HomePage';

function App() {
  return (
    < >
    <Router>
      <Switch>
        <Route path="/chat" component={ChatPage} />
        <Route path="/" component={HomePage} />
      </Switch>
    </Router>
    </>
  );
}

export default App;
