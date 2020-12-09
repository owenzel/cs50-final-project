// Library imports
import React from 'react';
import { Link } from 'react-router-dom';
import { Card, Button } from 'react-bootstrap';

export default function InfoCard(props) {
    // Declare the style of the card
    const style = {
        width: '18rem',
        backgroundColor: '#DBF5F7',
    };

    // If text (and a link) for a button is passed in as props, create a button for it. Otherwise, don't create a button for this card
    const button = props.buttonText ? <Link to={props.buttonLink}><Button variant="info">{props.buttonText}</Button></Link> : <></>;

    // Display the passed in information props as an instruction card
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