import moment from 'moment';
import React, { useContext } from "react";
import LogsContext from '../contexts/LogsContext';
import ChannelContext from '../contexts/ChannelContext';

const useLogs = () => {
  const { logs } = useContext(LogsContext);
  const { selectedChannel } = useContext(ChannelContext);

  const scrollBottom = () => document.querySelector('.log-container')
    ? document.querySelector('.log-container').scrollTop = document.querySelector('.log-container').scrollHeight + 9999
    : null;
  
  scrollBottom();

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
  
  const renderLogs = () => {
    const logs = renderLogs2();
    //welcome text 
  logs.unshift(
    <div className="channel-welcome">
      {/* picture here logo or something */}
      <div className="channel-welcome-title">
        Welcome to #
      {selectedChannel}!
      </div>
      <div className="channel-welcome-subtext">
        This is the start of the #{selectedChannel} channel.
        <div className="edit-channel">
          Edit Channel
        </div>
      </div>
    </div>
    )
    return logs;
  }

  return [renderLogs];
}

export default useLogs;
