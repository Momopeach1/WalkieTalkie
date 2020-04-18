import React from 'react';
import TextField from '@material-ui/core/TextField';

import '../../styles/MessageBox.css';
import useMessageBox from '../../hooks/useMessageBox';

const MessageBox = ()=>{
  const [message, handleOnChange, handleOnSubmit, handleOnKeyPress] = useMessageBox();

  return(
    <form className="chat-form" onSubmit={handleOnSubmit}>
      <TextField
        className="message-box"
        id="standard-textarea"
        label="Channel Name"
        placeholder="Message Channel Name"
        value={message}
        multiline
        onKeyPress={handleOnKeyPress}
        onChange={handleOnChange}
        onFocus={ e => document.querySelector('#standard-textarea-label').style.transform = 'translate(0, 1.5px) scale(0.75)' }
        onBlur={ e=> document.querySelector('#standard-textarea-label').style.transform = 'translate(0, 17px) scale(1)' }
      />
    </form>
  )
}

export default MessageBox;
