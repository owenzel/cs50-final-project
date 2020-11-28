import React from "react";
import { Route, Switch, Link } from 'react-router-dom';
import './App.css';

//Components:
import Home from './home/home';
import Register from './register/register';
import Profile from './profile/profile';

export default function App() {
  return (
    <div>
      <Navbar />

      {/* A <Switch> looks through its children <Route>s and 
          renders the first one that matches the current URL. */}
      <Switch>
          <Route path="/" component={Home} exact />
          <Route path="/register" component={Register} />
          <Route path="/profile" component={Profile} />
      </Switch>
    </div>
  );
}

function Navbar() {
  return (
    <nav class="navbar navbar-expand-lg navbar-light bg-light">
      <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
        <span class="navbar-toggler-icon"></span>
      </button>
      <div class="collapse navbar-collapse" id="navbarNav">
        <ul class="navbar-nav">
          <li class="nav-item">
            <Link className="nav-link" to="/">Home </Link>
          </li>
          <li class="nav-item">
            <Link className="nav-link" to="/register">Register </Link>
          </li>
          <li class="nav-item">
            <Link className="nav-link" to="/profile">Profile </Link>
          </li>
        </ul>
      </div>
    </nav>
  );
};