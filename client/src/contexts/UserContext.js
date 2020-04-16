import React, { useEffect, useState } from "react";
import { auth, generateUserDocument } from "../firebase";
import history from "../utilities/history";

const UserContext = React.createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    auth.onAuthStateChanged(async userAuth => {
      const response = await generateUserDocument(userAuth);
      response ? history.push('/chat'): history.push('/');
      setUser(response);
    })
  }, [])

  return (
    <UserContext.Provider value={{ user, setUser }}>
      { children }
    </UserContext.Provider>
  );
}

export default UserContext;