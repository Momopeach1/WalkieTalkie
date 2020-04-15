import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import React from 'react';


const ChatPage = () => {
    const arrowDown = () => <svg width="18" height="18" class="button-1w5pas open-1Te94t"><g fill="none" fill-rule="evenodd"><path d="M0 0h18v18H0"></path><path stroke="currentColor" d="M4.5 4.5l9 9" stroke-linecap="round"></path><path stroke="currentColor" d="M13.5 4.5l-9 9" stroke-linecap="round"></path></g></svg>;
    return (
        <div>
            <Grid container spacing ={0}>
                <Grid item className="sidebar" xs={3}>
                    <Paper>
                        <div className="primary-color group-title">
                            <span>
                                Indecent Group
                            </span>
                            <span>
                            <ExpandMoreIcon />
                            </span>
                        </div>
                    </Paper>
                </Grid>
                <Grid item className="main-chat" xs ={9}>
                    <Paper>
                        <div className="secondary-color">
                            General Discussion
                        </div>
                    </Paper>
                </Grid>
            </Grid>
        </div>
    );
}

export default ChatPage;