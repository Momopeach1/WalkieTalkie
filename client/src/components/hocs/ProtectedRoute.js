import React, { useContext } from 'react';
import { Route, Redirect } from 'react-router-dom';

import UserProvider from '../contexts/UserContext';

const ProtectedRoute = props => {
    const { user } = useContext(UserProvider);
    
    return user? <Route {...props} /> : <Redirect to="/signin" />;
};

export default ProtectedRoute;