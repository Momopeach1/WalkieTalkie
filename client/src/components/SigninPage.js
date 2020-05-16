import React, { useState, useContext } from "react";
import { Link } from 'react-router-dom';

import server from '../apis/server';
import UserContext from '../contexts/UserContext';
import history from '../utilities/history';

const SignIn = () => {

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);

  const { setUser, setIsAuth } = useContext(UserContext);

  const signInWithEmailAndPasswordHandler = (event,email, password) => {
      event.preventDefault();
      server.post('/user/signin', { email, password })
        .then(response => {
          setUser(response.data);
          setIsAuth(true);
          history.push('/chat');
        })
        .catch(error => console.log(error));
    };
    
    const onChangeHandler = (event) => {
        const {name, value} = event.currentTarget;
      
        if(name === 'userEmail') {
          setEmail(value);
        }
        else if(name === 'userPassword'){
          setPassword(value);
        }
    };
return (
  <div >
    <h1>Sign In</h1>
    <div>
      {error !== null && <div>{error}</div>}
      <form>
        <label htmlFor="userEmail">
          Email:
        </label>
        <input
          type="email"
          name="userEmail"
          value = {email}
          placeholder="youremail@gmail.com"
          id="userEmail"
          onChange = {(event) => onChangeHandler(event)}
        />
        <label htmlFor="userPassword">
          Password:
        </label>
        <input
          type="password"
          name="userPassword"
          value = {password}
          placeholder="Password"
          id="userPassword"
          onChange = {(event) => onChangeHandler(event)}
        />
        <button onClick = {(event) => {signInWithEmailAndPasswordHandler(event, email, password)}}>
          Sign in
        </button>
      </form>
      <p>or</p>
      <button
        onClick={() => {
          window.location.href = 'http://localhost:8080/api/user/oauth/google';
        }}
      >
        Sign in with Google
      </button>
      <p>
        Don't have an account?{" "}
        <Link to="signUp" >
          Sign up here
        </Link>{" "}
        <br />{" "}
        <Link to="passwordReset">
          Forgot Password?
        </Link>
      </p>
    </div>
  </div>
);
};

export default SignIn;