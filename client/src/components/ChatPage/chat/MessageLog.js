import React from 'react';

import useLogs from '../../../hooks/useLogs';

const MessageLog = ()=> {
  const [renderLogs] = useLogs();

  return(
    <div className="logs-container">
      { renderLogs() }
    </div>
  )
}

export default MessageLog;