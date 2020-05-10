import React from "react";

import { ContextMenu, ContextMenuTrigger } from "react-contextmenu";
import VoiceMenu from './VoiceMenu';
import '../../styles/ContextMenu.css';

 
const ContextMenuWrapper = ({ talker, children }) => {
  const collect = () => {
    return { talker }
  }

  return (
    <div>
      <ContextMenuTrigger collect={collect} id={talker.socketId}>
        { children }
      </ContextMenuTrigger>
 
      <ContextMenu id={talker.socketId}>
        <VoiceMenu />
      </ContextMenu>
 
    </div>
  );
}
 
export default ContextMenuWrapper;