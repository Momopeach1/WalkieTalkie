import { useEffect } from 'react';
import { auth, firestore } from "../firebase";
import history from '../utilities/history';

import firebase from 'firebase/app';
import 'firebase/firestore';


const SignoutPage = () =>{
  useEffect(()=>{
    auth.signOut()
      .then(() => {
        history.push('/');
      });
  },[])
}

export default SignoutPage;