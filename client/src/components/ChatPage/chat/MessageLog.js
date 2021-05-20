import React, { useContext } from 'react';

import useLogs from '../../../hooks/useLogs';
import LogsContext from '../../../contexts/LogsContext';
import server from '../../../apis/server';
import ChannelContext from '../../../contexts/ChannelContext';
import { MESSAGE_LIMIT } from '../../../configs';

const MessageLog = ()=> {
  const [renderLogs] = useLogs();
  const { logs, appendLogs} = useContext(LogsContext);
  const { selectedChannel } = useContext(ChannelContext);
  console.log(logs, 'peepeepoopoo');

  return(
    <div className="logs-container">
      <button onClick={()=> appendLogs(selectedChannel.id)}>
        more messages
      </button>
      { renderLogs() }
    </div>
  )
}

export default MessageLog;