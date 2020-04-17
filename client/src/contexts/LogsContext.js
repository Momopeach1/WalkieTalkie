import React, { useState } from 'react';

const LogsContext = React.createContext();

export const LogsProvider = ({ children }) => {
  const [logs, setLogs] = useState([]);

  return (
    <LogsContext.Provider value={ { logs, setLogs } }>
      { children }
    </LogsContext.Provider>
  );
};

export default LogsContext;
