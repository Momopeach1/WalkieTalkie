import React, { useState, useRef } from 'react';

import server from '../apis/server';

const ChannelContext = React.createContext();

export default ChannelContext;

export const ChannelProvider = ({ children }) => {
  const [channels, setChannels] = useState([]);
  const [selectedChannel, setSelectedChannel] = useState('');
  const filteredChannels = useRef({ textChannels: [], voiceChannels: [] });

  const fetchChannels = () => {
    server.get('/channel')
      .then(response => {
        setChannels(response.data);
        setSelectedChannel(response.data.find(channel => channel.type === 'text').name);
        filteredChannels.current.textChannels = [];
        filteredChannels.current.voiceChannels = [];
        for(let channel of response.data){
          if(channel.type === 'voice') filteredChannels.current.voiceChannels.push(channel);
          else                         filteredChannels.current.textChannels.push(channel);
        }
        console.log(filteredChannels.current)
      })
      .catch(error => console.log(error));
  }

  return(
    <ChannelContext.Provider value={{ channels, setChannels, fetchChannels, selectedChannel, setSelectedChannel, filteredChannels: filteredChannels.current }}>
      { children }
    </ChannelContext.Provider>
  )

}