import { useContext, useEffect } from 'react';

import server from '../apis/server';
import UserContext from '../contexts/UserContext';

const useApp = () => {
	const { setUser } = useContext(UserContext);

	useEffect(()=>{
    server.get('/user/check')
      .then(response => { 
        setUser(response.data); 
      })
      .catch(error => { console.log(error.response.data) });
	}, [])
}

export default useApp;