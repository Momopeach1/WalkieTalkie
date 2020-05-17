import React, { useContext } from 'react';
import { Route, Redirect } from 'react-router-dom';

import history from '../../utilities/history';
import UserProvider from '../../contexts/UserContext';


const GuestRoute = props => {
    const { isAuth } = useContext(UserProvider);

    const renderRoute = () => {
        if (isAuth === null) return null;
        else if (isAuth === false) return <Route { ...props } />;
        else return history.length > 2
          ? history.goBack()
          : <Route render={() => <Redirect to="/chat" />} />
    }
    
    return renderRoute();
};

export default GuestRoute;