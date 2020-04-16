import { useEffect } from 'react';
import { auth } from "../firebase";
import history from '../utilities/history';



const SignoutPage = () =>{
  useEffect(()=>{
    auth.signOut();
    history.push('/');
  },[])
}

export default SignoutPage;