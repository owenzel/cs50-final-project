import React from 'react';
import { withRouter } from "react-router-dom";
import { Button } from 'react-bootstrap';
import Axios from "axios";

function Logout(props){
    function handleClick(e) {
        //Send a POST request to log othe user out
        Axios.post('/logout').
            then((response) => {
            console.log(response);
            props.checkLoggedIn();
        }).
        then((response) => {
            this.props.history.push('/');
        });
    }
    
    return (
        <Button onClick={handleClick} variant="info">Log Out</Button>
    )
}

export default withRouter(Logout);