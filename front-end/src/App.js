import React, { useState, useEffect } from "react";
import { Route, Redirect, Switch } from 'react-router-dom';

//Components:
import NavBar from './navbar/navbar';
import Home from './home/home';
import Register from './register/register';
import Login from './login/login';
import Dashboard from './dashboard/dashboard';
import Profile from './profile/profile';

export default function App() {
  //Credit: https://www.w3schools.com/js/js_cookies.asp
  const loggedIn = (cname) => {
    var name = cname + "=";
    var decodedCookie = decodeURIComponent(document.cookie);
    var ca = decodedCookie.split(';');
    for(var i = 0; i <ca.length; i++) {
      var c = ca[i];
      while (c.charAt(0) == ' ') {
        c = c.substring(1);
      }
      if (c.indexOf(name) == 0) {
        console.log(c.substring(name.length, c.length))
        if (c.substring(name.length, c.length) == 'true')
        {
          return true;
        }
      }
    }
    return false;
  }

  const [user, setUser] = useState({ loggedIn: loggedIn('loggedIn') });

  //Set the background color of every page
  useEffect(() => {
    document.body.style.backgroundColor = '#F8FBFE';
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