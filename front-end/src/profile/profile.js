// Library imports
import React, { useRef, useState } from 'react';
import { Row, Col, Container, Form, Button, Alert } from 'react-bootstrap';
import Axios from "axios";

export default function Profile(props) {
    // Use the UseRef React Hook to reference all of the fields in the profile form
    const orgRef = useRef();
    const addressRef = useRef();
    const orgRefDisplay = useRef();
    const addressRefDisplay = useRef();
    const dayRef = useRef();

    // Use the UseState React Hook to display an alert to the user if there is an error sending a request to the server
    const [alert, setAlert] = useState(<></>);

    // Send a POST request with an ID of 1 (as opposed to 2 -- see the second POST request) to the server to obtain any profile information that the user previously submitted (if any)
    Axios.post('/profile', {
        params: {
            id: 1
        }
    })
    .then((response) => {
        // If the user had previously filled out the form, then display that information
        if (response.data) {
            orgRefDisplay.current.value = response.data.organization
            addressRefDisplay.current.value = response.data.address
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

    // Handle the user updating their profile information
    function handleSubmit(e) {
        // Prevent the page from refreshing
        e.preventDefault();

        // Send a POST request to the server with an ID of 2 (as opposed to 1 -- see the above POST request) to update the user's profile information in the database
        Axios.post('/profile', {
            organization: orgRef.current.value,
            address: addressRef.current.value,
            day: parseInt(dayRef.current.value),
            params: {
                id: 2
            }
        })
        .then((response) => {
            // Update information displayed on the page, and clear text input fields
            orgRefDisplay.current.value = response.data.organization
            addressRefDisplay.current.value = response.data.address

            orgRef.current.value = ''
            addressRef.current.value = ''
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
    
    // Display the profile form (with any previously submitted information)
    return ( 
        <Container className="mt-5">
            <Row>
                {alert}
            </Row>
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
