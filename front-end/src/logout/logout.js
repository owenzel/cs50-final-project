import React from 'react';
import { Button } from 'react-bootstrap';
import Axios from "axios";

function Logout(props){
    function handleClick(e) {
        props.setUser({ loggedIn: false });
        
        //Send a POST request to log the user out
        Axios.post('/logout')
        .then((response) => {
            console.log(response);
        })
        .catch(err => console.log(err));
    }
    
    return (
        <Button onClick={handleClick} variant="info">Log Out</Button>
    )
}

export default Logout;