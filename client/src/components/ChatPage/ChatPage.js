import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Hidden from '@material-ui/core/Hidden';
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
        <Grid item className="sidebar" sm={3} md={2}>
          <Hidden xsDown>
            <Paper>
              <div className="primary-color group-title">
                <span className="group-name">Indecent Group</span>
                <span>{arrowDown()}</span>
                <button onClick={() => auth.signOut()}>Signout</button>
              </div>
            </Paper>
          </Hidden>
        </Grid>

        <Grid item className="main-chat" xs={12} sm={9} md={10}>
          <ChannelHeader />

          <Grid className="below-header-container" container spacing={0}>
            
            <Grid className="message-ui" item xs={12} sm={9} md={10}>
              <Chat />
            </Grid>
            <Grid item sm={3} md={2}>
              <Hidden xsDown>
                <ActiveMemberBar />
              </Hidden>
            </Grid>
            
          </Grid>
        </Grid>
      </Grid>
      {/* <button onClick={()=> history.push('/profile')}>profile</button> */}
    </div>
  );
}

export default ChatPage;