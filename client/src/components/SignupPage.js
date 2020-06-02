import React, { useState } from "react";
import { Link } from 'react-router-dom';
import history from '../utilities/history';
import server from '../apis/server';

import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography'

import '../styles/RegistrationPage.css';
import { Grid } from "@material-ui/core";

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
      const { id, value } = event.target;
  
      if (id === "userEmail") {
        setEmail(value);
      } else if (id === "userPassword") {
        setPassword(value);
      } else if (id === "displayName") {
        setDisplayName(value);
      }
    };
  
    return (
      <div className="back">
          <div className="registration-block">
            <Grid container spacing={3}>
              <Grid className ="registration-left" item xs={6}>
                <Typography 
                  variant="h2" 
                  className="registration-title"
                  >
                  Registration
                </Typography>
                {error !== null && <div>{error}</div>}
                <form className="registration-form">
                  <div className="text-field">
                    <TextField
                      required
                      id="displayName"
                      className="text-field"
                      value={displayName}
                      label="UserName"
                      variant="outlined"
                      placeholder="Name"
                      onChange={(event) => onChangeHandler(event)}
                    />
                  </div>
                  <div className="text-field">
                    <TextField
                      required
                      id="userEmail"
                      className="text-field"
                      value={email}
                      label="Email"
                      placeholder="Email"
                      variant="outlined"
                      onChange={(event) => onChangeHandler(event)}
                    />
                  </div>
                  <div className="text-field">
                    <TextField 
                      required
                      id="userPassword"
                      className="text-field"
                      value={password}
                      placeholder="Password"
                      type="password"
                      variant="outlined"
                      onChange={(event) => onChangeHandler(event)}
                    />
                  </div>
                  <button 
                  className="register-button"
                  onClick = {(event) => {createUserWithEmailAndPasswordHandler(event, email, password)}}
                  >
                    Register
                  </button>
                </form>
                <p>
                  Have an account?{" "}
                  <Link to="signin" >
                    Log in here
                  </Link>{" "}
                  <br />{" "}
                  <Link to="passwordReset">
                    Forgot Password?
                  </Link>
                </p>
              </Grid>
              <Grid item xs={6}>
                {/* image */}
              </Grid>
            </Grid>
          </div>
        </div>
    );
  };
  
  export default SignUp;