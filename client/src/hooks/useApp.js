import { useContext, useEffect } from 'react';
import firebase from 'firebase/app';

import UserContext from '../contexts/UserContext';
import { generateUserDocument } from '../firebase';

const useApp = () => {
	const { setUser } = useContext(UserContext);
	
	useEffect(()=>{
		firebase.auth().onAuthStateChanged(async function(user) {
		
		const response = await generateUserDocument(user);
		
		setUser(response);
		});
	}, [])
}

export default useApp;