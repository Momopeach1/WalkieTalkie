import { useContext, useEffect } from 'react';

import server from '../apis/server';
import UserContext from '../contexts/UserContext';

const useApp = () => {
	const { user, setUser } = useContext(UserContext);

	useEffect(()=>{
    const response = server.get('/user/check')
      .then(response => {  })
      .catch(error => { console.log(error.response.data) });
		
		// setUser(response.data);
	}, [])
}

export default useApp;