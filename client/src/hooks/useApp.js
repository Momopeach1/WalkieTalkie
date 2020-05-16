import { useContext, useEffect } from 'react';

import server from '../apis/server';
import UserContext from '../contexts/UserContext';

const useApp = () => {
	const { setUser, setIsAuth, isAuth } = useContext(UserContext);

	useEffect(()=>{
    console.log('isAuth', isAuth)
    server.get('/user/check')
      .then(response => { 
        setUser(response.data);
        setIsAuth(true);
      })
      .catch(error => { 
        setIsAuth(false);
        console.log(error.response.data);
      });
	}, [])
}

export default useApp;