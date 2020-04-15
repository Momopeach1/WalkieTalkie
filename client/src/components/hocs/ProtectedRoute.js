import React, { useContext } from 'react';
import { Route } from 'react-router-dom';
import UserProvider from '../providers/UserProvider';

const ProtectedRoute = props => {
    const state = useContext(UserProvider);
    console.log(state);
    // const renderRoute = new Promise((resolve,reject)=>{
    //     firebase.auth().onAuthStateChanged(function(user) {
    //         if(user){
    //             resolve (true);
    //         }
    //         else{
    //             resolve(false);
    //         }
    //       }); 
    // })
    //const route = await renderRoute;
    return <Route {...props}/>;
};

export default ProtectedRoute;