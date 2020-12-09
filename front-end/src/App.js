// Library imports
import React, { useState, useEffect } from "react";
import { Route, Redirect, Switch } from 'react-router-dom';

// Component imports
import NavBar from './navbar/navbar';
import Home from './home/home';
import Register from './register/register';
import Login from './login/login';
import Dashboard from './dashboard/dashboard';
import Profile from './profile/profile';

export default function App() {
  // Declare a function that parses the browser cookies string and returns whether or not the passed in key and value exist in the cookies -- Credit for most of the function: https://www.w3schools.com/js/js_cookies.asp
  const loggedIn = (cname, vname) => {
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
        if (c.substring(name.length, c.length) == vname)
        {
          return true;
        }
      }
    }
    return false;
  }

  // Use the UseState React Hook to change the links (and the navbar) available to the user based on whether they're logged in
  const [user, setUser] = useState({ loggedIn: loggedIn('loggedIn', 'true') });

  // Set the background color of every page upon loading
  useEffect(() => {
    document.body.style.backgroundColor = '#F8FBFE';
  }, []);

  // Display the Navbar and use Switch and Route to render components based on the current URL
  return (
    <div>
      <NavBar loggedIn={user.loggedIn} setUser={setUser}/>

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