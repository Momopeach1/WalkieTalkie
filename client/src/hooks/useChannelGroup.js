import React, { useEffect, useContext } from 'react';
import ChannelContext from '../contexts/ChannelContext'



const useChannelGroup = () => {
  const { channels, fetchChannels, setSelectedChannel } = useContext(ChannelContext);

  useEffect(() => {
    fetchChannels();
  }, [])
  
  const handleOnClick = e => {
    setSelectedChannel(e.target.value);
  }


  const renderChannels = () => {
    return channels.map((ch, i) => {
      return (
        <div>
          <input type="radio" id={`${i}`} name="channel-radio" className="channel-radio" value={ch.name} onClick={handleOnClick} />
          <label htmlFor={`${i}`}>{ch.name}</label>
        </div>
      )
    })
  }


  return [renderChannels];
}


export default useChannelGroup;