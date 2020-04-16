import React, { useContext } from 'react';
import { Redirect, Route } from 'react-router-dom';
import UserProvider from '../../contexts/UserContext';


const GuestRoute = props => {
    const { user } = useContext(UserProvider);
    
    return !user ? <Route {...props} /> : <Redirect to="/chat" />;
};

export default GuestRoute;