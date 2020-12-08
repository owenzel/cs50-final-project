import React, { useState, useEffect } from "react";
import { Route, Redirect, Switch } from 'react-router-dom';
import './App.css';

//Components:
import NavBar from './navbar/navbar';
import Home from './home/home';
import Register from './register/register';
import Login from './login/login';
import Dashboard from './dashboard/dashboard';
import Profile from './profile/profile';
import Axios from "axios";

//TODO: Add logic for changing the navbar for when the user is vs. isn't logged in:
 // When the user is logged in, they should have a home, dashboard, profile, and log out page
 // When the user is not logged in, they should have a home, register, and log in page

export default function App() {
  const [user, setUser] = useState({ loggedIn: true});

  //Set the background color of every page:
  useEffect(() => {
    document.body.style.backgroundColor = '#F8FBFE';
    
    Axios.post('/loggedIn', {
    })
    .then(response => {
      setUser({ loggedIn: response.data.loggedIn});
    })
    .catch(error => {
      console.log(error);
    });
  }, []);

  return (
    <div>
      <NavBar loggedIn={user.loggedIn} setUser={setUser}/>

      {/* A <Switch> looks through its children <Route>s and 
          renders the first one that matches the current URL. */}
      <Switch>
          <Route path="/" exact>
            <Home />
          </Route>
          <Route path="/register">
            {user.loggedIn ? <Redirect to="/" /> : <Register />}
          </Route>
          <Route path="/login">
            {user.loggedIn ? <Redirect to="/" /> : <Login setUser={setUser}/>}
          </Route>
          <Route path="/dashboard">
            {user.loggedIn ? <Dashboard /> : <Redirect to="/" />}
          </Route>
          <Route path="/profile">
            {user.loggedIn ? <Profile /> : <Redirect to="/" />}
          </Route>
          <Redirect from="*" to="/" />
      </Switch>
    </div>
  );
}