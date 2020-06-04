import React, { useState, useRef } from 'react';

import server from '../apis/server';

const ChannelContext = React.createContext();

export default ChannelContext;

export const ChannelProvider = ({ children }) => {
  const [channels, setChannels] = useState([]);
  const [textChannels, setTextChannels] = useState([]);
  const [voiceChannels, setVoiceChannels] = useState([]);
  const [whiteboardChannels, setWhiteboardChannels] = useState([]);
  const [selectedChannel, setSelectedChannel] = useState({ name: '', type: '' });
  const [selectedVoice, setSelectedVoice] = useState('');
  const [filteredChannels, setFilteredChannels] = useState({ textChannels: [], voiceChannels: [] });
  const [talkers, setTalkers] = useState({});

  const fetchTextChannels = () => {
    server.get('/text')
      .then(response => {
        setTextChannels(response.data);
        setSelectedChannel({ name: response.data[0].name, type: 'text' }); //always assume we have at least one text channel left
      })
      .catch(err => console.log(err));
  };

  const fetchVoiceChannels = () => {
    server.get('/voice')
      .then(response => {
        setVoiceChannels(response.data);
        let newTalkers = {};

        for (let ch of response.data) {
          for (let key in ch.talkers) {
            newTalkers[ch.name] = !newTalkers[ch.name]
            ? [JSON.parse(ch.talkers[key])] 
            : [...newTalkers[ch.name], JSON.parse(ch.talkers[key])];
          }
        }
        setTalkers(newTalkers);
      })
      .catch(err => console.log(err));
  };

  const fetchWhiteboardChannels = () => {
    server.get('/whiteboard')
      .then(response => {
        setWhiteboardChannels(response.data);
      })
      .catch(err => console.log(err));
  };


  return(
    <ChannelContext.Provider value={{ 
      channels, 
      setChannels, 
      selectedChannel, 
      setSelectedChannel, 
      talkers,
      setTalkers,
      selectedVoice, 
      setSelectedVoice,
      fetchTextChannels,
      textChannels,
      voiceChannels,
      setVoiceChannels,
      fetchVoiceChannels,
      fetchWhiteboardChannels,
      whiteboardChannels
    }}>
      { children }
    </ChannelContext.Provider>
  )

}