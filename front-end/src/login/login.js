import React, { useRef, useState } from 'react';
import { Row, Col, Container, Form, Button, Alert } from 'react-bootstrap';

import Axios from "axios";

export default function Login(props){
    const emailRef = useRef();
    const passwordRef = useRef();

    const [alert, setAlert] = useState(<></>)

    function handleSubmit(e) {
        e.preventDefault();
        // If all fields are filled out, POST the data
        Axios.post('/login', {
            email: emailRef.current.value,
            password: passwordRef.current.value,
        }).then((response) => {
            console.log(response);
            // If there was an error, alert the user
            if (response.data.error) {
                e.preventDefault();
                setAlert(
                    <Alert variant="danger">
                        <Alert.Heading>{response.data.error}</Alert.Heading>
                    </Alert>
                );
            }

            // If there were no errors, update the cookies and the state to reflect the user's login
            else {
                if (response.data.loggedIn) {
                    document.cookie = 'loggedIn=true';
                    props.setUser({ loggedIn: true});
                } else {
                    document.cookie = 'loggedIn=false';
                    props.setUser({ loggedIn: false});
                }
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