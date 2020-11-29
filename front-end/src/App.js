import React, { useEffect } from "react";
import { Route, Switch, Link } from 'react-router-dom';
import Axios from "axios";
import './App.css';

//Components:
import Home from './home/home';
import Register from './register/register';
import Login from './login/login';
import Profile from './profile/profile';

//TODO: Add logic for changing the navbar for when the user is vs. isn't logged in:
 // When the user is logged in, they should have a home, dashboard, profile, and log out page
 // When the user is not logged in, they should have a home, register, and log in page

export default function App() {
  //Set the background color of every page:
  useEffect(() => {
    document.body.style.backgroundColor = '#F8FBFE';
  }, []);

  return (
    <div>
      <Navbar/>

      {/* A <Switch> looks through its children <Route>s and 
          renders the first one that matches the current URL. */}
      <Switch>
          <Route path="/" component={Home} exact />
          <Route path="/register" component={Register} />
          <Route path="/login" component={Login} />
          <Route path="/profile" component={Profile} />
      </Switch>
    </div>
  );
}

function Navbar() {
  const linkStyle = {
    color: "black",
    fontSize: "150%",
    marginRight: "3px"
  }

  return (
    <nav class="navbar navbar-expand-lg" style={{ backgroundColor:'#FAFAFA' }}>
      <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
        <span class="navbar-toggler-icon"></span>
      </button>
      <div class="collapse navbar-collapse" id="navbarNav">
        <ul class="navbar-nav">
          <li class="nav-item">
            <Link className="nav-link" to="/" style={linkStyle}>Home </Link>
          </li>
          <li class="nav-item">
            <Link className="nav-link" to="/register" style={linkStyle}>Register </Link>
          </li>
          <li class="nav-item">
            <Link className="nav-link" to="/login" style={linkStyle}>Log in </Link>
          </li>
        </ul>
      </div>
    </nav>
  );
};