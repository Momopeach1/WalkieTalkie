import { useState, useContext } from 'react';
import SocketContext from '../contexts/SocketContext';
import UserContext from '../contexts/UserContext';

const useMessageBox = () => {
  const [message, setMessage] = useState({ text: '', timestamp: Date() });
  const { socket } = useContext(SocketContext);
  const { user } = useContext(UserContext);
  const { displayName, photoURL } = user;

  const handleOnChange = e => {
    setMessage({text: e.target.value, timestamp: Date() });
  }

  const handleOnSubmit = e => {
    e.preventDefault();
    if (message.text.trim().length === 0) return;
    socket.emit('send message', { message, displayName, photoURL });
  }

  const handleOnKeyPress = e => {
    if (e.shiftKey && e.key === 'Enter') {
      // Default Behavior
    } else if (e.key === 'Enter') {
      handleOnSubmit(e);
      setMessage({ text: '', timestamp: Date() });
    }
  }

  return [message, handleOnChange, handleOnSubmit, handleOnKeyPress]
}

export default useMessageBox;