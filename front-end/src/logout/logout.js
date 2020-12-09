// Library imports
import React from 'react';
import { Button } from 'react-bootstrap';
import Axios from "axios";

export default function Logout(props) {
    // Handle the user pressing the log out button
    function handleClick(e) {
        // Update the cookies and state to reflect the user's log out on the client side
        document.cookie = 'loggedIn=false';
        props.setUser({ loggedIn: false });
        
        //Send a POST request to log the user out on the server side, and alert the user and log the error to the console if it failed
        Axios.post('/logout')
        .catch(err => {
            console.log(err);
            alert('Log out failed. Please try again.');
        });
    }
    
    // Display a log out button
    return (
        <Button onClick={handleClick} variant="info">Log Out</Button>
    )
}