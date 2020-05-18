import React from 'react';

import useSettings from '../../../hooks/useSettings';
 
const SettingsSidebar = () => {
  const [handleOnSignout] = useSettings();
  return (
    <div className="settings-sidebar" >
      <div className="signout" onClick={handleOnSignout} >Sign Out</div>
    </div>
  );
}
 
export default SettingsSidebar;