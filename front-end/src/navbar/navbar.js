import React from 'react';
import { Nav } from 'react-bootstrap';
import { Link } from 'react-router-dom';

export default function Navbar(props) {
    const linkStyle = {
      color: "black",
      fontSize: "150%",
      marginRight: "3px"
    }
  
    //Navigation links to render based on whether the user is logged in
    const navLinks = props.loggedIn ? 
    <>
      <Nav.Item as="li">
        <Link className="nav-link" to="/dashboard" style={linkStyle}>Dashboard </Link>
      </Nav.Item>
      <Nav.Item as="li">
        <Link className="nav-link" to="/profile" style={linkStyle}>Profile </Link>
      </Nav.Item>
      <Nav.Item as="li">
        <Link className="nav-link" to="/logout" style={linkStyle}>Log Out </Link>
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