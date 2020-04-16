import React, { useState, useEffect } from "react";
import { auth, generateUserDocument } from "../../firebase";

const UserContext = React.createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    auth.onAuthStateChanged(async userAuth => {
      const response = await generateUserDocument(userAuth);
      setUser(response);
    })
  }, [])

  return (
    <UserContext.Provider value={{ user }}>
      { children }
    </UserContext.Provider>
  );
}

export default UserContext;