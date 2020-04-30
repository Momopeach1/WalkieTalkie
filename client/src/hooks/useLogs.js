import moment from 'moment';
import React, { useContext } from "react";
import LogsContext from "../contexts/LogsContext";


const useLogs = () => {
  const { logs } = useContext(LogsContext);
  console.log('logs', logs);
  const appendLogs = () => {
    let result = [];
    let messages = [];
    for (let i = 0; i < logs.length; ++i) {
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
    // return logs.map(log => {
    //   console.log(moment().diff(log.message.timestamp, 'seconds'));
    //   return (
    //     <div className="log">
    //       <div>
    //         <img className="avatar" src={log.photoURL} />
    //       </div>
    //       <div>
    //         <div className="message-header-container">
    //           <div className="displayName-text">{log.displayName}</div>
    //           <div className="timestamp-text">{moment(log.message.timestamp).calendar()} </div>
    //         </div>
    //         <div className="whitney-book message">{log.message.text}</div>
    //       </div>
    //     </div>
    //   );
    // });
  }

  return [renderLogs];
}

export default useLogs;
