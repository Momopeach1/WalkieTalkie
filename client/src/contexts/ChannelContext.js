import React, { useState, useRef } from 'react';

import server from '../apis/server';

const ChannelContext = React.createContext();

export default ChannelContext;

export const ChannelProvider = ({ children }) => {
  const [channels, setChannels] = useState([]);
  const [selectedChannel, setSelectedChannel] = useState('');
  const [selectedVoice, setSelectedVoice] = useState('');
  const [filteredChannels, setFilteredChannels] = useState({ textChannels: [], voiceChannels: [] });
  const [talkers, setTalkers] = useState({});

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
        
        let newTalkers = {};

        for (let ch of response.data) {
          for (let key in ch.talkers) {
            newTalkers[ch.name] = !newTalkers[ch.name]
            ? [JSON.parse(ch.talkers[key])] 
            : [...newTalkers[ch.name], JSON.parse(ch.talkers[key])];
          }
        }
        console.log("new talkers", newTalkers);
        setTalkers(newTalkers);
      })
      .catch(error => console.log(error));
  }

  return(
    <ChannelContext.Provider value={{ 
      channels, 
      setChannels, 
      fetchChannels,
      selectedChannel, 
      setSelectedChannel, 
      filteredChannels,
      talkers,
      setTalkers,
      selectedVoice, 
      setSelectedVoice
    }}>
      { children }
    </ChannelContext.Provider>
  )

}