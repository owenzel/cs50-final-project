import React from 'react';
import { Link } from 'react-router-dom';
import { Card, Button } from 'react-bootstrap';

export default function InfoCard(props) {
    const style = {
        width: '18rem',
        backgroundColor: '#DBF5F7',
    };

    const button = props.buttonText ? <Link to={props.buttonLink}><Button variant="info">{props.buttonText}</Button></Link> : <></>;

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