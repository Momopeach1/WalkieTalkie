import React, { useState, useContext } from 'react';
import Modal from 'react-modal';

import SettingsSidebar from '../modals/settings/SettingsSidebar';
import { Grid } from '@material-ui/core';
import server from '../../apis/server';
import UserContext from '../../contexts/UserContext';
import SocketContext from '../../contexts/SocketContext';

import '../../styles/SettingsModal.css'

 
const customStyles = {
  content : {
    top                   : '50%',
    left                  : '50%',
    right                 : 'auto',
    bottom                : 'auto',
    marginRight           : '-50%',
    transform             : 'translate(-50%, -50%)',
    backgroundColor       : '#36393f',
    border                : 'none',
    width                 : '100%',
    padding               : '0',
    height                : '100vh'
  },
  overlay : {
    backgroundColor       : "rgb(0, 0, 0)"
  }
};
 
// Make sure to bind modal to your appElement (http://reactcommunity.org/react-modal/accessibility/)
Modal.setAppElement('#user-settings-modal')
 
const UserSettingsModal = ({ type }) => {
  const { user, setUser } = useContext(UserContext);
  const [form, setForm] = useState({ 
    photo: null, 
    displayName: user.displayName, 
    email: user.email, 
    currentPassword: '', 
    password: '' 
  });
  const [isEdit, setIsEdit] = useState(false);
  const [modalIsOpen, setIsOpen] = useState(false);
  const { socket } = useContext(SocketContext);
  const settingsIcon = <svg aria-hidden="false" width="20" height="20" viewBox="0 0 24 24"><path fill="currentColor" fill-rule="evenodd" clip-rule="evenodd" d="M19.738 10H22V14H19.739C19.498 14.931 19.1 15.798 18.565 16.564L20 18L18 20L16.565 18.564C15.797 19.099 14.932 19.498 14 19.738V22H10V19.738C9.069 19.498 8.203 19.099 7.436 18.564L6 20L4 18L5.436 16.564C4.901 15.799 4.502 14.932 4.262 14H2V10H4.262C4.502 9.068 4.9 8.202 5.436 7.436L4 6L6 4L7.436 5.436C8.202 4.9 9.068 4.502 10 4.262V2H14V4.261C14.932 4.502 15.797 4.9 16.565 5.435L18 3.999L20 5.999L18.564 7.436C19.099 8.202 19.498 9.069 19.738 10ZM12 16C14.2091 16 16 14.2091 16 12C16 9.79086 14.2091 8 12 8C9.79086 8 8 9.79086 8 12C8 14.2091 9.79086 16 12 16Z"></path></svg>

  const openModal = e => {
    e.stopPropagation();
    document.querySelectorAll('.cursor-container').forEach(n => n.remove());
    setIsOpen(true)
  };

  const handleOnChange = e => {
    setForm({ ...form, [e.target.id]: e.target.value });
  }

  const handleOnSubmit = e => {
    e.preventDefault();
    const formData = new FormData();
    if (form.photo) formData.append('photo', form.photo);
    formData.append('displayName', form.displayName);
    formData.append('email', form.email);
    formData.append('currentPassword', form.currentPassword);
    formData.append('password', form.password);

    server.put('/user/', formData)
      .then(result =>  {
        setUser(prevUser => { return { ...prevUser, ...result.data } });
        socket.emit('refresh users');
        setIsEdit(false);
      })
      .catch(error => console.log('failed update', error.response));
  }
 
  const closeModal = () => setIsOpen(false);

  const handleUploaderChange = () => {
    const photo = document.querySelector('.avatar-uploader');

    setForm({ ...form, photo: photo.files[0] });
  }

  const renderProfileInfo = () => {
    return(
      <div className="profile-info-container">
        <img className="settings-modal-avatar" src={user.photoURL} />
        <div className="settings-modal-info">
          <div className="settings-modal-subtitle">USERNAME</div>
          <div className="settings-modal-subtitle-content">{user.displayName}</div>
          <br></br>
          <div className="settings-modal-subtitle">EMAIL</div>
          <div className="settings-modal-subtitle-content">{user.email}</div>
        </div>
        <button className="settings-modal-edit" onClick={() => setIsEdit(true)}>Edit</button>
      </div>
    )
  }

  const renderProfileEdit = () => {
    if (isEdit) {
      return (
      <form onSubmit={handleOnSubmit}>
        <input onChange={handleUploaderChange} className="avatar-uploader" type="file" name="photo" style={{ display: "none" }} />
        <div onClick={() => document.querySelector(".avatar-uploader").click()}>
          <img className="settings-modal-avatar" src={user.photoURL} />
        </div>
        <input type="text" id="displayName" value={form.displayName} onChange={handleOnChange} />
        <input type="email" id="email" value={form.email} onChange={handleOnChange} />
        <input type="password" id="currentPassword" value={form.currentPassword} onChange={handleOnChange} />
        <input type="password" id="password" value={form.password} onChange={handleOnChange} />
        <button>Submit</button>
      </form>        
      )
    } else {
      return (renderProfileInfo())
    }
  }

  return (
    <>
      <span className="settings-button" onClick={openModal}>{settingsIcon}</span>
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        style={customStyles}
        contentLabel="Example Modal"
      >
        <div className="modal-content">
          <Grid container spacing={0}>
            <Grid item sm={4} md={2}>
              <SettingsSidebar/>
            </Grid>
            <Grid item sm={8} md={10}>
              <div className="setting-flex-container">
                <div className="setting-main">
                  <h2 className="user-modal-title">MY ACCOUNT</h2>
                  {renderProfileEdit()}
                </div>
                <div className="setting-fixed-container">
                    <div className="setting-exit" onClick={closeModal}>X</div>
                </div>
              </div>
            </Grid>
          </Grid>
        </div>
      </Modal>
    </>
  );
}
 
export default UserSettingsModal;