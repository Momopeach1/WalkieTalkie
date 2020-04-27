import React from 'react';
import '../../../styles/SideBar.css';
import AddChannelModal from './AddChannelModal';


const ChannelGroup = () => {
  const expander = () => <svg width="12" height="12" viewBox="0 0 24 24"><path fill="currentColor" fill-rule="evenodd" clip-rule="evenodd" d="M16.59 8.59004L12 13.17L7.41 8.59004L6 10L12 16L18 10L16.59 8.59004Z"></path></svg>
  
  return (
    <div className="channel-flex ">
      <span>
        <span className="text-channel-title expander">{ expander() }</span>
        <span className="text-channel-title">TEXT CHANNELS</span>
      </span>
      <AddChannelModal />
    </div>
  );
};

export default ChannelGroup;