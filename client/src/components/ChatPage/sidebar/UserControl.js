import  React from 'react';

import useUserControl from '../../../hooks/useUserControl';

const UserControl = () => {
  const [renderConnectionControls] = useUserControl();

  return(
    <>
      { renderConnectionControls() }
      <div className="user-control-container">
        nigger
      </div>
    </>
  )
}

export default UserControl;