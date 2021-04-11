import React, { useState, useRef } from 'react';
import server from '../apis/server';

const LogsContext = React.createContext();

export const LogsProvider = ({ children }) => {
  const messageMapRef = useRef({});
  const [logs, setLogs] = useState([]);

  const fetchMessages = async (channelName, limit) => {
    const response = await server.get('/message',  { params: { channelName, limit } });
    setLogs(response.data);
  }

  const fetchAllMessages = async (channelNames, limit) => {
    const response = await server.post('/message/all', { channelNames, limit });
    messageMapRef.current = response.data;
    console.log(messageMapRef.current)

  }

  return (
    <LogsContext.Provider value={ { logs, setLogs, fetchMessages, fetchAllMessages, messageMapRef } }>
      { children }
    </LogsContext.Provider>
  );
};

export default LogsContext;
