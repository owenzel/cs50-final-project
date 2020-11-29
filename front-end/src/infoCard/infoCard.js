import React from 'react';
import { Route, Switch, Link } from 'react-router-dom';
import { Card, Button } from 'react-bootstrap';

export default function InfoCard(props) {
    const style = {
        width: '18rem',
        backgroundColor: '#DBF5F7',
    };

    //TODO: add a prop for changing the to property of link and adjust home.js accordingly
    const button = props.buttonText ? <Link to="/register"><Button variant="info">{props.buttonText}</Button></Link> : <></>;

    return (
        <Card style={style}>
            <Card.Img variant="top" src={props.imgSrc} />
            <Card.Body>
                <Card.Title>{props.title}</Card.Title>
                <Card.Text>
                {props.body}
                </Card.Text>
                {button}
            </Card.Body>
        </Card>
    )
}