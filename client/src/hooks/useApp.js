import { useContext, useEffect } from 'react';

import server from '../apis/server';
import UserContext from '../contexts/UserContext';

const useApp = () => {
	const { setUser, setIsAuth, isAuth } = useContext(UserContext);
  console.log('Inside of use app', isAuth);
	useEffect(()=>{
    server.get('/user/check')
      .then(response => { 
        setUser(response.data);
        setIsAuth(true);
      })
      .catch(error => { 
        setIsAuth(false);
      });
	}, [])
}

export default useApp;