import React, { useState, useRef } from 'react';

import server from '../apis/server';

const ChannelContext = React.createContext();

export default ChannelContext;

export const ChannelProvider = ({ children }) => {
  const [channels, setChannels] = useState([]);
  const [textChannels, setTextChannels] = useState([]);
  const [voiceChannels, setVoiceChannels] = useState([]);
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

  // const fetchChannels = () => {
  //   server.get('/channel')
  //     .then(response => {
  //       setChannels(response.data);
  //       setSelectedChannel({ name: response.data.find(channel => channel.type === 'text').name, type: 'text' });
  //       setFilteredChannels({ textChannels: [], voiceChannels: [] })
  //       for(let channel of response.data){
  //         if(channel.type === 'voice') 
  //           setFilteredChannels(prevChannels => {
  //             return { ...prevChannels, voiceChannels: [...prevChannels.voiceChannels, channel] }
  //           })
  //         else {
  //           setFilteredChannels(prevChannels => {
  //             return { ...prevChannels, textChannels: [...prevChannels.textChannels, channel] }
  //           })
  //         }
  //       }
        
  //       let newTalkers = {};

  //       for (let ch of response.data) {
  //         for (let key in ch.talkers) {
  //           newTalkers[ch.name] = !newTalkers[ch.name]
  //           ? [JSON.parse(ch.talkers[key])] 
  //           : [...newTalkers[ch.name], JSON.parse(ch.talkers[key])];
  //         }
  //       }
  //       setTalkers(newTalkers);
  //     })
  //     .catch(error => console.log(error));
  // }

  return(
    <ChannelContext.Provider value={{ 
      channels, 
      setChannels, 
      // fetchChannels,
      selectedChannel, 
      setSelectedChannel, 
      filteredChannels,
      talkers,
      setTalkers,
      selectedVoice, 
      setSelectedVoice,
      fetchTextChannels,
      textChannels,
      voiceChannels,
      setVoiceChannels,
      fetchVoiceChannels
    }}>
      { children }
    </ChannelContext.Provider>
  )

}