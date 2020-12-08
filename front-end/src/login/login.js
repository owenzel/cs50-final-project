import React, { useRef } from 'react';
import { Row, Col, Container, Form, Button } from 'react-bootstrap';
import Axios from "axios";

export default function Login(props){
    const emailRef = useRef();
    const passwordRef = useRef();

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
                alert(response.data.error);
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
            alert("There was an error. Please refresh and try again.");
        });
    }

    return (
        <Container className="mt-5">
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