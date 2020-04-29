import React, { useState } from 'react';

import server from '../apis/server';

const ChannelContext = React.createContext();

export default ChannelContext;

export const ChannelProvider = ({ children }) => {
  const [channels, setChannels] = useState([]);

  const fetchChannels = () => {
    server.get('/channel')
      .then(response => setChannels(response.data))
      .catch(error => console.log(error));
  }

  return(
    <ChannelContext.Provider value={{ channels, setChannels, fetchChannels }}>
      { children }
    </ChannelContext.Provider>
  )

}