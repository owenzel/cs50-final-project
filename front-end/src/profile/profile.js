import React, { useEffect, useRef } from 'react';
import { Row, Col, Container, Form, Button } from 'react-bootstrap';
import Axios from "axios";
import './profile.css';

export default function Profile(props){
    const orgRef = useRef();
    const addressRef = useRef();

    // Send GET request upon loading the page
    useEffect(() => {
        Axios.get('/profile')
            .then((response) => {
                // If the user had previously filled in the form, then we display that information
                if (response.data) {
                    orgRef.current.value = response.data.organization
                    addressRef.current.value = response.data.address
                }
            })
            .catch(error => {
                console.log(error.response)
            });
    });

    function handleSubmit(event) {
        // If the organization field is filledc out, POST the data
        event.preventDefault();

        Axios.post('/profile', {
            organization: orgRef.current.value,
            address: addressRef.current.value,
        }).then((response) => {
            console.log(response)
        }).catch(error => {
            console.log(error.response)
        });
    }
    
    return (
        <Container className="mt-5">
            <Row>
                <Col className="mb-3"><h1>Profile</h1></Col>
            </Row>
            <Row>
                <Col>
                    <Form onSubmit={handleSubmit} className="w-100">
                        <Form.Group>
                            <Form.Label>Enter the organization you are affiliated with</Form.Label>
                            <Form.Control type="text" ref={orgRef} required ></Form.Control>
                        </Form.Group>
                        <Form.Group>
                            <Form.Label>Enter your address (optional)</Form.Label>
                            <Form.Control type="text" placeholder="XXXX Street Name, City, State ZIP" ref={addressRef} ></Form.Control>
                        </Form.Group>
                        <Button type="submit">Update Profile</Button>
                    </Form>
                </Col>
            </Row>
        </Container>
    )
}
