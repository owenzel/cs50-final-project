import React from 'react';
import { Row, Col, Container } from 'react-bootstrap';



export default function Dashboard(){

    var date = new Date();
    var d = 6 - date.getDay();
    var h = 24 - date.getHours();

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