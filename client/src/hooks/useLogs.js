import React, { useContext } from "react";
import LogsContext from "../contexts/LogsContext";

import '../styles/useLogs.css';

const useLogs = () => {
  const { logs } = useContext(LogsContext);
  
  const renderLogs = () => {
    return logs.map(log => {
      return (
        <>
          <span>
            <img className="avatar" src={log.photoURL} />
          </span>
          <span>
            <div>{log.displayName}</div>
            <div>{log.message}</div>
          </span>
        </>
      );
    });
  }

  return [renderLogs];
}

export default useLogs;
