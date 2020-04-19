import React, { useContext } from 'react';
import AllUsersContext from '../contexts/AllUsersContext';


const useActiveMemberBar = () => {
  const { allUsers } = useContext(AllUsersContext);
  
  const renderAllUsers = () => {
    return allUsers.map(user => {
      return user.socketId? (
        <div>
          <div>
            <img className="avatar" src={user.photoURL} />
          </div>
          <div>
            {user.displayName}
          </div>
        </div>
      ) : null;
    });
  };
  
  return [renderAllUsers];
};

export default useActiveMemberBar;