// Library imports
import React, { useRef, useState } from 'react';
import { Row, Container, Form, Alert } from 'react-bootstrap';
import Axios from "axios";

export default function Dashboard() {
    // Use the UseRef React Hook to reference the name and email displays
    const nameRef = useRef();
    const emailRef = useRef();

    // Use the UseState React Hook to display an alert to the user if there is an error sending a request to the server
    const [alert, setAlert] = useState(<></>);

    // Determine the number of days and hours away the next match is
    var date = new Date();
    var d = 6 - date.getDay();
    var h = 24 - date.getHours();
    
    // Send a POST request to the server to obtain the name and email of the logged in user
    Axios.post('/dashboard', {})
    .then((response) => {
        // If data was sent back from the server, update the name and email sections with the user's data that was just fetched
        if (response.data) {
            nameRef.current.value = response.data.name;
            emailRef.current.value = response.data.email;
        }

        // If data was not sent back from the server, alert the user
        else {
            setAlert(
                <Alert variant="danger">
                    <Alert.Heading>There was an error. Please refresh and try again.</Alert.Heading>
                </Alert>
            );
        }
    })
    // If there was an error with the POST request, alert the user and log the exact error to the console
    .catch(error => {
        console.log(error);
        setAlert(
            <Alert variant="danger">
                <Alert.Heading>There was an error. Please refresh and try again.</Alert.Heading>
            </Alert>
        );
    });

    // Display the user's match's name and email, as well as the days and hours to the next match
    return (
        <>
        {alert}
        <Container className="text-center" style={{ backgroundColor: "#B9E7CF"}}>
            <Row className="col-md-5 p-lg-5 mb-5 mt-3 mx-auto">
                <h4>Your match: </h4>
                <Form.Control type="text" class = "col-xs-3" ref={nameRef} readOnly /> 
                <h4>You can contact them at: </h4>
                <Form.Control type="text" class = "col-xs-3" ref={emailRef} readOnly />
            </Row>
        </Container>

        <Container className="text-center">
            <h4><b>{d} days and {h} hours</b> until your next match!</h4>
        </Container>
        </>
    )
}