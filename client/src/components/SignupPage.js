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
      <div className="back">
          <div className="registration-block">
            <Grid container spacing={3}>
              <Grid item xs={6}>
                <Typography 
                  variant="h2" 
                  className="registration-title"
                  >
                  Registration
                </Typography>
                {error !== null && <div>{error}</div>}
                <form className="registration-form">
                  <TextField
                    required
                    id="displayName"
                    name="displayName"
                    value={displayName}
                    label="UserName"
                    variant="outlined"
                    placeholder="Name"
                    onChange={(event) => onChangeHandler(event)}
                  />
                  <TextField
                    required
                    id="userEmail"
                    name="userEmail"
                    value={email}
                    label="Email"
                    placeholder="Email"
                    variant="outlined"
                    onChange={(event) => onChangeHandler(event)}
                  />
                  <TextField 
                    required
                    id="userPassword"
                    name="userPassword"
                    value={password}
                    placeholder="Password"
                    type="password"
                    variant="outlined"
                    onChange={(event) => onChangeHandler(event)}
                  />
                  <button onClick = {(event) => {createUserWithEmailAndPasswordHandler(event, email, password)}}>
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