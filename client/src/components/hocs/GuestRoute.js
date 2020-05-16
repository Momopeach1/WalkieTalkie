import React, { useContext } from 'react';
import { Redirect } from 'react-router-dom';

import history from '../../utilities/history';
import UserProvider from '../../contexts/UserContext';


const GuestRoute = props => {
    const { isAuth } = useContext(UserProvider);

    const renderRoute = () => {
        if (isAuth === null) return null;
        else if (isAuth === false) return <Redirect to="/signin" />
        else return history.goBack();
    }
    
    return renderRoute();
};

export default GuestRoute;