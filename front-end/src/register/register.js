import React, { useRef, useState } from 'react';
import { Row, Col, Container, Form, Button, Alert } from 'react-bootstrap';
import Axios from "axios";
import './register.css';

export default function Register(props){
    const nameRef = useRef();
    const emailRef = useRef();
    const passwordRef = useRef();
    const confirmPasswordRef = useRef();

    const [alert, setAlert] = useState(<></>)

    function handleSubmit(e) {
        e.preventDefault();

        // If the passwords don't match, alert the users
        if (passwordRef.current.value !== confirmPasswordRef.current.value)
        {
            setAlert(
                <Alert variant="danger">
                    <Alert.Heading>Passwords must match!</Alert.Heading>
                </Alert>
            );
            return;
        }

        // If the passwords match and all fields are filled out, POST the data
        Axios.post('/register', {
            name: nameRef.current.value,
            email: emailRef.current.value,
            password: passwordRef.current.value,
        }).then((response) => {
            // If there was an error, alert the user
            if (response.data.error) {
                setAlert(
                    <Alert variant="danger">
                        <Alert.Heading>{response.data.error}</Alert.Heading>
                    </Alert>
                );
            }
            // If there were no errors, alert the user that they can now log in and clear the input boxes
            else {
                setAlert(
                    <Alert variant="success">
                        <Alert.Heading>You are registered! Now you can log in with your new account!</Alert.Heading>
                    </Alert>
                );

                nameRef.current.value = "";
                emailRef.current.value = "";
                passwordRef.current.value = "";
                confirmPasswordRef.current.value = "";
            }
        })
        .catch(error => {
            console.log(error);
            setAlert(
                <Alert variant="danger">
                    <Alert.Heading>There was an error. Please refresh and try again.</Alert.Heading>
                </Alert>
            );
        });
    }
    
    return (
        <Container className="mt-5">
            <Row>
                {alert}
            </Row>
            <Row>
                <Col className="mb-3"><h1>Register</h1></Col>
            </Row>
            <Row>
                <Col>
                    <Form onSubmit={handleSubmit} className="w-100">
                        <Form.Group>
                            <Form.Label>Enter Your Full Name</Form.Label>
                            <Form.Control type="text" ref={nameRef} required ></Form.Control>
                        </Form.Group>
                        <Form.Group>
                            <Form.Label>Enter Your Email</Form.Label>
                            <Form.Control type="email" ref={emailRef} required ></Form.Control>
                        </Form.Group>
                        <Form.Group>
                            <Form.Label>Enter Your Password</Form.Label>
                            <Form.Control type="password" ref={passwordRef} required ></Form.Control>
                        </Form.Group>
                        <Form.Group>
                            <Form.Label>Enter Your Password Again</Form.Label>
                            <Form.Control type="password" ref={confirmPasswordRef} required ></Form.Control>
                        </Form.Group>
                        <Button type="submit">Register</Button>
                    </Form>
                </Col>
            </Row>
        </Container>
    )
}