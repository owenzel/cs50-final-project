import React from 'react';
import { Row, Col, Container } from 'react-bootstrap';

//Components:
import InfoCard from './../infoCard/infoCard';

//Images:
import nameTag from './../assets/name-tag.jpg'; //Credit: http://clipart-library.com/nametag-cliparts.html
import questionMarks from './../assets/question-marks.png'; //Credit: http://clipart-library.com/images_k/question-clipart-transparent/question-clipart-transparent-9.png
import emailIcon from './../assets/email-icon.png'; //Credit: http://clipart-library.com/image_gallery/276318.png
import mouseClick from './../assets/mouse-click.png'; //Credit: http://clipart-library.com/new_gallery/61-617464_red-mouse-click-icon-png-download-click-arrow.png
import schedule from './../assets/schedule.png'; //Credit: http://clipart-library.com/newhp/105-1059879_clipart-calendar-meeting-schedule.png
import friends from './../assets/friends.png'; //Credit: http://clipart-library.com/newhp/10-102347_best-friends-png-best-friend-clipart-png.png

export default function Home() {
    return (
        <>
        <Container className="text-center" style={{ backgroundColor: "#B9E7CF"}}>
            <Row className="col-md-5 p-lg-5 mb-5 mt-3 mx-auto">
                <h1 className="display-4 font-weight-normal mx-auto">VirtuConnect</h1>
                <p className="lead font-weight-normal mx-auto">Meet your new best friend!</p>
            </Row>
        </Container>
        <Container className="container marketing mx-auto mb-5">
            <Row>
                <Col >
                    <InfoCard
                        imgSrc={nameTag}
                        title="1. Sign Up for an Account"
                        body="Click 'Register', and enter your name, email, and password to sign up for a free account!"
                        buttonText="Register"
                        buttonLink="/register"
                    />
                </Col>
                <Col >
                    <InfoCard
                        imgSrc={questionMarks}
                        title="2. Log in and Fill Out Your Profile"
                        body="After you create your account, log in, click 'Profile', and fill out the questionnaire so we can find your new friend."
                        buttonText="Log In"
                        buttonLink="/login"
                    />
                </Col>
                <Col >
                    <InfoCard
                        imgSrc={emailIcon}
                        title="3. Check Your Email"
                        body="Look out for an email from us within 48 of completing your profile, notifying you that you've been matched."
                    />
                </Col>
                <Col >
                    <InfoCard
                        imgSrc={mouseClick}
                        title="4. Log in and Visit the Dashboard"
                        body="Log into this website, and visit your dashboard to learn more about your new friend."
                        buttonText="Log In"
                        buttonLink="/login"
                    />
                </Col>
                <Col >
                    <InfoCard
                        imgSrc={schedule}
                        title="5. Schedule an Online Meet-Up"
                        body="Once you've been matched, you're ready to schedule an online get-to-know-you session. Click the 'Schedule' button on the dashboard to get the process started."
                        buttonText="Dashboard"
                        buttonLink="/dashboard"
                    />
                </Col>
                <Col >
                    <InfoCard
                        imgSrc={friends}
                        title="6. Continue Getting to Know Each Other"
                        body="We will continue to send you emails to schedule future meet ups based on the availability you set in your profile. If you would like to stop having meetings or change the schedule, please log in and update your profile."
                        buttonText="Dashboard"
                        buttonLink="/dashboard"
                    />
                </Col>
            </Row>
        </Container>
        </>
    )
}