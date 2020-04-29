import React, { useEffect, useContext } from 'react';
import ChannelContext from '../contexts/ChannelContext'



const useChannelGroup = () => {
  const { channels, fetchChannels } = useContext(ChannelContext);
  

  useEffect(() => {
    fetchChannels();
  }, [])

  const renderChannels = () => {
    return channels.map(ch => {
      return (
        <div>
          {ch.name}
        </div>
      )
    })
  }


  return [renderChannels];
}


export default useChannelGroup;