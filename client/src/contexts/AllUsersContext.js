import React, { useState } from 'react';

const AllUsersContext = React.createContext();

export default AllUsersContext;

export const AllUsersProvider = ({ children }) => {
  const [allUsers, setAllUsers] = useState([]);
  return(
    <AllUsersContext.Provider value={{ allUsers, setAllUsers }}>
      { children }
    </AllUsersContext.Provider>
  )
}