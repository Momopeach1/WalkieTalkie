import { useState, useContext } from 'react';
import SocketContext from '../contexts/SocketContext';
import UserContext from '../contexts/UserContext';

const useMessageBox = () => {
  const [message, setMessage] = useState('');
  const { socket } = useContext(SocketContext);
  const { user } = useContext(UserContext);
  const { displayName, photoURL } = user;

  const handleOnChange = e => {
    setMessage(e.target.value);
  }

  const handleOnSubmit = e => {
    e.preventDefault();
    if (message.trim().length === 0) return;
    socket.emit('send message', { message, displayName, photoURL });
  }

  const handleOnKeyPress = e => {
    if (e.shiftKey && e.key === 'Enter') {
      // Default Behavior
    } else if (e.key === 'Enter') {
      handleOnSubmit(e);
      setMessage('');
    }
  }

  return [message, handleOnChange, handleOnSubmit, handleOnKeyPress]
}

export default useMessageBox;