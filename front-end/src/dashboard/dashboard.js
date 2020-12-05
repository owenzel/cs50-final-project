import React, { useEffect, useRef } from 'react';
import { Row, Container } from 'react-bootstrap';
import Axios from "axios";



export default function Dashboard(){

    var date = new Date();
    var d = 6 - date.getDay();
    var h = 24 - date.getHours();

    const nameRef = useRef();
    
    // Send GET request upon loading the page
    useEffect(() => {
        // TODO: Sometimes only loads the second time, need to fix
        Axios.get('/dashboard')
            .then((response) => {
                if (response.data) {
                    nameRef.current.value = response.data.name;
                }
            })
            .catch(error => {
                console.log(error.response)
            });
    });

    return (
        <>
        <Container className="text-center" style={{ backgroundColor: "#B9E7CF"}}>
            <Row className="col-md-5 p-lg-5 mb-5 mt-3 mx-auto">
                <h4><b>{d} days and {h} hours</b> until your next match!</h4>
            </Row>
        </Container>

        <Container className="text-center">
            <h4>Your previous matches: </h4>
        </Container>

        </>
    )
}