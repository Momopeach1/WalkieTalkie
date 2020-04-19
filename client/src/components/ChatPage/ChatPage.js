import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import React from 'react';
import { Link } from 'react-router-dom';

import Chat from './chat/Chat';
import useChat from '../../hooks/useChat';
import '../../styles/ChatPage.css';
import history from '../../utilities/history';
import ChannelHeader from './ChannelHeader';
import ActiveMemberBar from './ActiveMemberBar';
import { auth } from '../../firebase';

const ChatPage = () => {
  useChat();

  const arrowDown = () => <svg width="18" height="18" className="button-1w5pas"><g fill="none" fill-rule="evenodd"><path d="M0 0h18v18H0"></path><path stroke="currentColor" d="M4.5 4.5l9 9" stroke-linecap="round"></path><path stroke="currentColor" d="M13.5 4.5l-9 9" stroke-linecap="round"></path></g></svg>;
  return (
    <div>
      <Grid container spacing={0}>
        <Grid item className="sidebar" xs={12} sm={5} md={4} lg={3} xl={2}>
          <Paper>
            <div className="primary-color group-title">
              <span className="group-name">Indecent Group</span>
              <span>{arrowDown()}</span>
              <button onClick={() => auth.signOut()}>Signout</button>
            </div>
          </Paper>
        </Grid>

        <Grid item className="main-chat" xs ={12} sm={7} md={8} lg={9} xl={10}>
          <ChannelHeader />
          
          <Grid className="below-header-container" container spacing={0}>
            
            <Grid className="message-ui" item xs={10}>
              <Chat />
            </Grid>
            <Grid item xs={2}>
              <ActiveMemberBar />
            </Grid>
            
          </Grid>
        </Grid>
      </Grid>
      {/* <button onClick={()=> history.push('/profile')}>profile</button> */}
    </div>
  );
}

export default ChatPage;