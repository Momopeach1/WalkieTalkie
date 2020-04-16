import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import React, { useEffect, useState } from 'react';
import openSocket from 'socket.io-client';
import '../styles/ChatPage.css';
import history from '../utilities/history';



const ChatPage = () => {
  const [msg,setMsg] = useState('');
  const [socket,setSocket]= useState(null);
  useEffect(()=>{
    setSocket(openSocket());
  },[])
  const arrowDown = () => <svg width="18" height="18" className="button-1w5pas"><g fill="none" fill-rule="evenodd"><path d="M0 0h18v18H0"></path><path stroke="currentColor" d="M4.5 4.5l9 9" stroke-linecap="round"></path><path stroke="currentColor" d="M13.5 4.5l-9 9" stroke-linecap="round"></path></g></svg>;
  return (
    <div>
      <Grid container spacing={0}>
        <Grid item className="sidebar" xs={12} sm={5} md={4} lg={3} xl={2}>
          <Paper>
            <div className="primary-color group-title">
              <span className="group-name">Indecent Group</span>
              <span>{arrowDown()}</span>
            </div>
          </Paper>
        </Grid>
        <Grid item className="main-chat" xs ={12} sm={7} md={8} lg={9} xl={10}>
          <Paper>
            <div className="secondary-color">
                General Discussion
            </div>
          </Paper>
          <Paper>
            <textarea onChange={e=>setMsg(e.target.value)}>
            </textarea>
          </Paper>
        </Grid>
      </Grid>
      <button onClick={()=> history.push('/profile')}>profile</button>
      <button onClick={()=> socket.emit('send',{msg:msg})}> send </button>
    </div>
  );
}

export default ChatPage;