// Library imports
import React from 'react';
import { Nav } from 'react-bootstrap';
import { Link } from 'react-router-dom';

// Component imports
import Logout from '../logout/logout';

export default function Navbar(props) {
    // Declare the style of all of the links on the nav bar
    const linkStyle = {
      color: "black",
      fontSize: "150%",
      marginRight: "3px"
    }
  
    // Declare which navigation links to render based on whether the user is logged in
    const navLinks = props.loggedIn ? 
    <>
      <Nav.Item as="li">
        <Link className="nav-link" to="/dashboard" style={linkStyle}>Dashboard </Link>
      </Nav.Item>
      <Nav.Item as="li">
        <Link className="nav-link" to="/profile" style={linkStyle}>Profile </Link>
      </Nav.Item>
      <Nav.Item as="li">
        <Link className="nav-link" style={linkStyle} to="/"><Logout setUser={props.setUser}/></Link>
      </Nav.Item>
    </>
    :
    <>
      <Nav.Item as="li">
        <Link className="nav-link" to="/register" style={linkStyle}>Register </Link>
      </Nav.Item>
      <Nav.Item as="li">
        <Link className="nav-link" to="/login" style={linkStyle}>Log In </Link>
      </Nav.Item>
    </>
  
    // Display the navigation bar with the home link and the other appropriate links based on whether the user is logged in
    return (
      <>
      <Nav defaultActiveKey="/home" as="ul">
        <Nav.Item as="li">
          <Link className="nav-link" to="/" style={linkStyle}>Home </Link>
        </Nav.Item>
        {navLinks}
      </Nav>
      </>
    );
  };