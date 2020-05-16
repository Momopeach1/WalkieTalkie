import React, { useState } from 'react';
import server from '../apis/server';

const LogsContext = React.createContext();

export const LogsProvider = ({ children }) => {
  const [logs, setLogs] = useState([]);

  const fetchMessages = async () => {
    const response = await server.get('/message');
    setLogs(response.data);
  }

  return (
    <LogsContext.Provider value={ { logs, setLogs, fetchMessages } }>
      { children }
    </LogsContext.Provider>
  );
};

export default LogsContext;
