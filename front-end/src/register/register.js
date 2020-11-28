import React, { useRef } from 'react';
import { Row, Col, Container, Form, Button } from 'react-bootstrap';
import Axios from "axios";
import './register.css';

export default function Register(){
    const nameRef = useRef();
    const emailRef = useRef();
    const passwordRef = useRef();
    const confirmPasswordRef = useRef();

    function handleSubmit(e) {
        // If the passwords don't match, alert the users
        if (passwordRef.current.value !== confirmPasswordRef.current.value)
        {
            e.preventDefault();
            alert("Passwords must match!");
            return;
        }

        // If the passwords match and all fields are filled out, POST the data
        Axios.post('/register', {
            name: nameRef.current.value,
            email: emailRef.current.value,
            password: passwordRef.current.value,
        }).then((response) => {
            console.log(response);
        });
    }
    
    return (
        <Container className="mt-5">
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