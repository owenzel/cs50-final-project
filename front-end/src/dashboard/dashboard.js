import React, { useEffect, useRef } from 'react';
import { Row, Container, Form } from 'react-bootstrap';
import Axios from "axios";

export default function Dashboard(){

    var date = new Date();
    var d = 6 - date.getDay();
    var h = 24 - date.getHours();

    const nameRef = useRef();
    const emailRef = useRef()
    
        // TODO: Sometimes only loads the second time, need to fix
        Axios.post('/dashboard', {})
        .then((response) => {
            console.log(response.data)
            if (response.data) {
                nameRef.current.value = response.data.name;
                emailRef.current.value = response.data.email;
            }
        })
        .catch(error => {
            console.log(error.response)
        });

    return (
        <>

        <Container className="text-center" style={{ backgroundColor: "#B9E7CF"}}>
            <Row className="col-md-5 p-lg-5 mb-5 mt-3 mx-auto">
                <h4>Your match: </h4>
                <Form.Control type="text" class = "col-xs-3" ref={nameRef} readOnly /> 
                <h4> </h4>
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