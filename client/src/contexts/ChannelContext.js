import React, { useState } from 'react';

import server from '../apis/server';

const ChannelContext = React.createContext();

export default ChannelContext;

export const ChannelProvider = ({ children }) => {
  const [channels, setChannels] = useState([]);
  const [selectedChannel, setSelectedChannel] = useState('');
  console.log(selectedChannel);
  const fetchChannels = () => {
    server.get('/channel')
      .then(response => {
        setChannels(response.data);
        setSelectedChannel(response.data[0].name);
      })
      .catch(error => console.log(error));
  }

  return(
    <ChannelContext.Provider value={{ channels, setChannels, fetchChannels, selectedChannel, setSelectedChannel }}>
      { children }
    </ChannelContext.Provider>
  )

}