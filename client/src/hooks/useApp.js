import React, { useContext, useEffect } from 'react';
import { Route, Redirect } from 'react-router-dom';
import firebase from 'firebase/app';

import SignupPage from '../components/SignupPage';
import SigninPage from '../components/SigninPage';
import ChatPage from '../components/ChatPage/ChatPage';
import ProfilePage from '../components/ProfilePage';
import SignoutPage from '../components/SignoutPage';
import UserContext from '../contexts/UserContext';
import { generateUserDocument } from '../firebase';

const useApp = () => {
	const { user, setUser } = useContext(UserContext);

	const guestRoutes = () => {
		return (
			<>
				<Route path="/signup" component={SignupPage} />
				<Route path="/signin" component={SigninPage} />
			</>
		);
	}

	const protectedRoutes = () => {
		return (
			<>
				<Route path="/chat" component={ChatPage} />
				<Route path="/profile" component={ProfilePage} />
				<Route path="/signout" component={SignoutPage} />

				<Redirect to="/chat" />
			</>
		);
	}

	const renderRoutes = () => {
		return user? protectedRoutes() : guestRoutes();
	}

	useEffect(()=>{
		firebase.auth().onAuthStateChanged(async function(user) {
		
		const response = await generateUserDocument(user);
		
		setUser(response);
		});
	}, [])
	return [renderRoutes];
	
}

export default useApp;