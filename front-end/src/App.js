import React, { useState, useEffect } from "react";
import { Route, Redirect, Switch } from 'react-router-dom';
import Axios from "axios";
import './App.css';

//Components:
import NavBar from './navbar/navbar';
import Home from './home/home';
import Register from './register/register';
import Login from './login/login';
import Dashboard from './dashboard/dashboard';
import Profile from './profile/profile';

//TODO: Add logic for changing the navbar for when the user is vs. isn't logged in:
 // When the user is logged in, they should have a home, dashboard, profile, and log out page
 // When the user is not logged in, they should have a home, register, and log in page

export default function App() {
  const [loggedIn, setLoggedIn] = useState(false);

  //Set the background color of every page:
  useEffect(() => {
    document.body.style.backgroundColor = '#F8FBFE';
  }, []);

  const checkLoggedIn = () => {
    //Check whether the user is logged in
    Axios.post('/loggedIn', {
    })
    .then(response => {
      if (response.data.loggedIn) {
        console.log('logged in on front-end');
        setLoggedIn(true);
      } else {
        console.log('not logged in on front-end');
        setLoggedIn(false);
      }
    })
    .catch(error => {
      console.log(error);
    });
  }

  return (
    <div>
      <NavBar loggedIn={loggedIn}/>

      {/* A <Switch> looks through its children <Route>s and 
          renders the first one that matches the current URL. */}
      <Switch>
          <Route path="/" exact>
            <Home checkLoggedIn={checkLoggedIn}/>
          </Route>
          <Route path="/register">
            {loggedIn ? <Redirect to="/dashboard" /> : <Register checkLoggedIn={checkLoggedIn}/>}
          </Route>
          <Route path="/login">
            {loggedIn ? <Redirect to="/dashboard" /> : <Login checkLoggedIn={checkLoggedIn}/>}
          </Route>
          <Route path="/dashboard">
            {loggedIn ? <Dashboard /> : <Redirect to="/login" />}
          </Route>
          <Route path="/profile">
            {loggedIn ? <Profile /> : <Redirect to="/login" />}
          </Route>
          <Route path="/logout">
            {/*TODO: Implement Log Out Page */}
            {loggedIn ? <div>Log Out</div> : <Redirect to="/" />}
          </Route>
          <Redirect from="*" to="/" />
      </Switch>
    </div>
  );
}