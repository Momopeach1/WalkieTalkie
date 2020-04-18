import React, { useContext } from "react";
import LogsContext from "../contexts/LogsContext";

const useLogs = () => {
  const { logs } = useContext(LogsContext);
  
  const renderLogs = () => {
    return logs.map(log => {
      return (
        <div className="log">
          <div>
            <img className="avatar" src={log.photoURL} />
          </div>
          <div>
            <div>{log.displayName}</div>
            <div className="whitney-book message">{log.message}</div>
          </div>
        </div>
      );
    });
  }

  return [renderLogs];
}

export default useLogs;
