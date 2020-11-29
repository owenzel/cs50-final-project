import React from 'react';
import { Row, Col, Container } from 'react-bootstrap';

//Components:
import InfoCard from './../infoCard/infoCard';

export default function Dashboard(){
    return (
        <>
        <Container className="text-center" style={{ backgroundColor: "#B9E7CF"}}>
            <Row className="col-md-5 p-lg-5 mb-5 mt-3 mx-auto">
                <h1 className="display-4 font-weight-normal mx-auto">Dashboard</h1>
                <p className="lead font-weight-normal mx-auto">Your Match</p>
            </Row>
        </Container>
        </>
    )
}