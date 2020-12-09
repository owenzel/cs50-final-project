// Library imports
import React, { useRef, useState } from 'react';
import { Row, Col, Container, Form, Button, Alert } from 'react-bootstrap';
import Axios from "axios";

export default function Login(props) {
    // Use the UseRef React Hook to reference the email and password input fields
    const emailRef = useRef();
    const passwordRef = useRef();

    // Use the UseState React Hook to display an alert to the user if there is an error (and update the state based on the type of error)
    const [alert, setAlert] = useState(<></>)

    // Handle the user pressing the log in button
    function handleSubmit(e) {
        // Prevent the default refresh upon form submission
        e.preventDefault();

        // If all input fields are filled out, POST the data
        Axios.post('/login', {
            email: emailRef.current.value,
            password: passwordRef.current.value,
        })
        .then((response) => {
            // If there was an error, prevent the page from refreshing and alert the user
            if (response.data.error) {
                e.preventDefault();
                setAlert(
                    <Alert variant="danger">
                        <Alert.Heading>{response.data.error}</Alert.Heading>
                    </Alert>
                );
            }
            // If there were not errors with the POST request,
            else {
                // If there were no errors and the server sent back that the user is logged in, update the cookies and the state to reflect the user's login
                if (response.data.loggedIn) {
                    document.cookie = 'loggedIn=true';
                    props.setUser({ loggedIn: true});
                }
                // If the server didn't throw an error but didn't send back that the user was logged in, alert the user to try again
                else {
                    setAlert(
                        <Alert variant="danger">
                            <Alert.Heading>There was an error. Please refresh and try again.</Alert.Heading>
                        </Alert>
                    );
                }
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
    }

    // Display a log in form
    return (
        <Container className="mt-5">
            <Row>
                {alert}
            </Row>
            <Row>
                <Col className="mb-3"><h1>Log In</h1></Col>
            </Row>
            <Row>
                <Col>
                    <Form onSubmit={handleSubmit} className="w-100">
                        <Form.Group>
                            <Form.Label>Enter Your Email</Form.Label>
                            <Form.Control type="email" ref={emailRef} required ></Form.Control>
                        </Form.Group>
                        <Form.Group>
                            <Form.Label>Enter Your Password</Form.Label>
                            <Form.Control type="password" ref={passwordRef} required ></Form.Control>
                        </Form.Group>
                        <Button type="submit">Log In</Button>
                    </Form>
                </Col>
            </Row>
        </Container>
    )
}