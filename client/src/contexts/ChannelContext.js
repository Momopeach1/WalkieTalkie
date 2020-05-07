import React, { useState, useRef } from 'react';

import server from '../apis/server';

const ChannelContext = React.createContext();

export default ChannelContext;

export const ChannelProvider = ({ children }) => {
  const [channels, setChannels] = useState([]);
  const [selectedChannel, setSelectedChannel] = useState('');
  const [filteredChannels, setFilteredChannels] = useState({ textChannels: [], voiceChannels: [] });

  const fetchChannels = () => {
    server.get('/channel')
      .then(response => {
        setChannels(response.data);
        setSelectedChannel(response.data.find(channel => channel.type === 'text').name);
        setFilteredChannels({ textChannels: [], voiceChannels: [] })
        for(let channel of response.data){
          if(channel.type === 'voice') 
            setFilteredChannels(prevChannels => {
              return { ...prevChannels, voiceChannels: [...prevChannels.voiceChannels, channel] }
            })
          else {
            setFilteredChannels(prevChannels => {
              return { ...prevChannels, textChannels: [...prevChannels.textChannels, channel] }
            })
          }
        }
        console.log(filteredChannels)
      })
      .catch(error => console.log(error));
  }

  return(
    <ChannelContext.Provider value={{ channels, setChannels, fetchChannels, selectedChannel, setSelectedChannel, filteredChannels }}>
      { children }
    </ChannelContext.Provider>
  )

}