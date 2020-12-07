import React, { useEffect, useRef } from 'react';
import { Row, Container } from 'react-bootstrap';
import Axios from "axios";

export default function Dashboard(){

    var date = new Date();
    var d = 6 - date.getDay();
    var h = 24 - date.getHours();

    const nameRef = useRef();
    var matchInfo;
    
    // Send GET request upon loading the page
        console.log('use effect')
        // TODO: Sometimes only loads the second time, need to fix
        Axios.post('/dashboard', {})
        .then((response) => {
            if (response.data) {
                nameRef.current.value = response.data.name;
                matchInfo = response.data;
                console.log("MATCH1: " + response.data.name)
            }
        })
        .catch(error => {
            console.log(error.response)
        });

    return (
        <>
        <Container className="text-center" style={{ backgroundColor: "#B9E7CF"}}>
            <Row className="col-md-5 p-lg-5 mb-5 mt-3 mx-auto">
                <h4><b>{d} days and {h} hours</b> until your next match!</h4>
            </Row>
        </Container>

        <Container className="text-center">
            <h4>Your match: {matchInfo.name} </h4>
            <h4>You can contact them at {matchInfo.email} </h4>
        </Container>

        </>
    )
}