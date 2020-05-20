import moment from 'moment';
import React, { useContext } from "react";

import LogsContext from '../contexts/LogsContext';
import ChannelContext from '../contexts/ChannelContext';
import { MaskedViewComponent } from 'react-native';

const useLogs = () => {
  const { logs } = useContext(LogsContext);
  const { selectedChannel } = useContext(ChannelContext);

  const renderLogs2 = () => {
    return logs.map((log, i) => {
      if (log.channel.name !== selectedChannel) return null;

      const previousUser = i > 0? logs[i-1].sender.email : null;
      const currentUser = log.sender.email;
      const previousTime = i > 0? logs[i-1].createdAt : new Date(-8640000000000000); //before common era
      const currentTime = log.createdAt;

      return !isSameUser(previousUser, currentUser) || !isRecent(previousTime, currentTime)? (
        <div className="log">
          <div>
            <img className="avatar" src={log.sender.photoURL}/>
          </div>
          <div>
            <div className="message-header-container">
              <div className="displayName-text">{log.sender.displayName}</div>
              <div className="timestamp-text">{moment(log.createdAt).calendar()}</div>
            </div>
            <div className="whitney-book message">{log.content}</div>
          </div>
        </div>
      ) : (
        <div className="appended-message">
          <span className="hover-timestamp timestamp-text">{moment(log.createdAt).format('LT')}</span>
          <span className="whitney-book message">{log.content}</span>
        </div>
      )
    })
  }

  const isSameUser = (previousUser, currentUser) => previousUser === currentUser;

  const isRecent = (previousTime, currentTime) => moment(currentTime).diff(moment(previousTime), 'seconds') <= 5;
  

  const appendLogs = () => {
    let result = [];
    let messages = [];
    
    for (let i = 0; i < logs.length; ++i) {
      if (logs[i].channel.name !== selectedChannel) continue;
      if (i === 0 || (logs[i].sender.displayName === logs[i-1].sender.displayName && moment(logs[i].createdAt).diff(moment(logs[i-1].createdAt), 'seconds') <= 5 ) ) {
        messages.push(<div className="whitney-book message">{logs[i].content}</div>);
      } else {
        result.push(
          <div className="log">
            <div>
              <img className="avatar" src={logs[i-1].sender.photoURL} />
            </div>
            <div>
              <div className="message-header-container">
                <div className="displayName-text">{logs[i-1].sender.displayName}</div>
                <div className="timestamp-text">{moment(logs[i-1].createdAt).calendar()} </div>
              </div>
              { messages }
            </div>
          </div>          
        );

        messages = [];

        messages.push(<div className="whitney-book message">{logs[i].content}</div>);
      }
    }

    if (messages.length > 0) {
      result.push(
        <div className="log">
          <div>
            <img className="avatar" src={logs[logs.length-1].sender.photoURL} />
          </div>
          <div>
            <div className="message-header-container">
              <div className="displayName-text">{logs[logs.length-1].sender.displayName}</div>
              <div className="timestamp-text">{moment(logs[logs.length-1].createdAt).calendar()} </div>
            </div>
            { messages }
          </div>
        </div>          
      );
    }

    return result;
  }

  const renderLogs = () => {
    return appendLogs();

    // return renderLogs2();
  }

  return [renderLogs];
}

export default useLogs;
