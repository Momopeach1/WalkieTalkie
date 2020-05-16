import React, { useState } from "react";
import { Link } from 'react-router-dom';
import history from '../utilities/history';
import server from '../apis/server';

import '../styles/RegistrationPage.scss';

const SignUp = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [displayName, setDisplayName] = useState("");
    const [error, setError] = useState(null);
  
    const createUserWithEmailAndPasswordHandler = async (event, email, password) => {
      event.preventDefault();
      try{
        // const {user} = await auth.createUserWithEmailAndPassword(email, password);
        // generateUserDocument(user, {displayName});
        await server.post('/user/signup', { displayName, email, password });
        history.push('/signin');
      }
      catch(error){
        setError('Error Signing up with email and password');
      }
      setEmail("");
      setPassword("");
      setDisplayName("");
    };
  
    const onChangeHandler = event => {
      const { name, value } = event.currentTarget;
  
      if (name === "userEmail") {
        setEmail(value);
      } else if (name === "userPassword") {
        setPassword(value);
      } else if (name === "displayName") {
        setDisplayName(value);
      }
    };
  
    return (
      <div class="back">
        <div class="registration-form">
          <header>
            <h1>Sign Up</h1>
            <p> Fill stuff in </p>
          </header>
          <div>
            {error !== null && (
              <div>
                {error}
              </div>
            )}
            <form>
              <div class="input-section email-section" >
                {/* <label htmlFor="displayName">
                  Display Name:
                </label>
                <input
                  type="text"
                  name="displayName"
                  value={displayName}
                  placeholder="Hentai"
                  id="displayName"
                  onChange={event => onChangeHandler(event)}
                /> */}

                <label htmlFor="userEmail">
                  Email:
                </label>
                <input
                  type="email"
                  name="userEmail"
                  value={email}
                  placeholder="Hentai23@gmail.com"
                  id="userEmail"
                  onChange={event => onChangeHandler(event)}
                  />

                {/* button */}
                <div class="animated-button">
                  <span class="icon-paper-plane">
                    <i class="fa fa-envelope-o" />
                  </span>
                  <span class="next-button email">
                    <i class="fa fa-arrow-up" />
                  </span>
                </div>
              </div>

              <div class="input-section password-section folded">
                <label htmlFor="userPassword">
                  Password:
                </label>
                <input
                  type="password"
                  name="userPassword"
                  value={password}
                  placeholder="Your Password"
                  id="userPassword"
                  onChange={event => onChangeHandler(event)}
                />
                <div class="animated-button">
                  <span class="icon-lock">
                    <i class="fa fa-lock" />
                  </span>
                  <span class="next-button password">
                    <i class="fa fa-arrow-up"/>
                  </span>
                </div>
              </div>

              {/* <button
                onClick={event => {
                  createUserWithEmailAndPasswordHandler(event, email, password);
                }}
              >
                Sign up
              </button> */}

            </form>
            <p>or</p>
            <button
              onClick={() => {
                try {
                } catch (error) {
                  console.error("Error signing in with Google", error);
                }
              }}
            >
              Sign In with Google
            </button>
            <p>
              Already have an account?{" "}
              <Link to="/SignIn">
                Sign in here
              </Link>{" "}
            </p>
          </div>
        </div>
      </div>
    );
  };
  
  export default SignUp;