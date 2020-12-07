import React, { useEffect, useRef } from 'react';
import { Row, Col, Container, Form, Button } from 'react-bootstrap';
import Axios from "axios";
import './profile.css';

export default function Profile(props){
    const orgRef = useRef();
    const addressRef = useRef();

    const orgRefDisplay = useRef();
    const addressRefDisplay = useRef();

    const dayRef = useRef();

    // Send GET request upon loading the page
    useEffect(() => {
        // Axios.get('/profile', {
        Axios.post('/profile', {
            params: {
                id: 1
            }
        }).then((response) => {
            // If the user had previously filled in the form, then we display that information
            if (response.data) {
                orgRefDisplay.current.value = response.data.organization
                addressRefDisplay.current.value = response.data.address
            }
        }).catch(error => {
            console.log(error.response)
        });
    });

    function handleSubmit(event) {
        // If the form field is filled out, POST the data
        event.preventDefault();
        console.log(dayRef.current.value);

        Axios.post('/profile', {
            organization: orgRef.current.value,
            address: addressRef.current.value,
            day: parseInt(dayRef.current.value),
            params: {
                id: 2
            }
        }).then((response) => {
            orgRefDisplay.current.value = response.data.organization
            addressRefDisplay.current.value = response.data.address

            orgRef.current.value = ''
            addressRef.current.value = ''
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
                            <Form.Label>We currently have on record that you are affiliated with the following organization:</Form.Label>
                            <Form.Control type="text" ref={orgRefDisplay} readOnly /> 
                        </Form.Group>

                        <Form.Group>
                            <Form.Label>Enter your address</Form.Label>
                            <Form.Control type="text" placeholder="XXXX Street Name, City, State ZIP" ref={addressRef} required></Form.Control>
                        </Form.Group>
                        <Form.Group>
                            <Form.Label>We currently have on record that your address is:</Form.Label>
                            <Form.Control type="text" ref={addressRefDisplay} readOnly /> 
                        </Form.Group>

                        <Form.Group>
                            <Form.Label>Please indicate your preferred meeting time below.</Form.Label>
                            <Form.Control as="select" ref={dayRef} required>
                                <option value="1">Monday</option>
                                <option value="2">Tuesday</option>
                                <option value="3">Wednesday</option>
                                <option value="4">Thursday</option>
                                <option value="5">Friday</option>
                                <option value="6">Saturday</option>
                                <option value="7">Sunday</option>
                            </Form.Control>
                        </Form.Group>

                        {/* TODO: need to store interests */}
                        <Form.Label>Please indicate your interests below.</Form.Label>
                        <Form.Group>
                            <Form.Check inline label="math" type="checkbox"></Form.Check>
                            <Form.Check inline label="sleep" type="checkbox"></Form.Check>
                            <Form.Check inline label="food" type="checkbox"></Form.Check>
                        </Form.Group>

                        <Button type="submit">Update Profile</Button>
                    </Form>
                </Col>
            </Row>
        </Container>
    )
}
