import React from "react";
import logo from './logo.svg';
import './App.css';

//Components:
import Register from './register/register'

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <p>
          VirtuConnect
        </p>
        <Register />
      </header>
    </div>
  );
}

export default App;
