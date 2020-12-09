// Imports
require('dotenv').config();
const express = require('express'); // Web development framework
const session = require('express-session'); //Middleware for saving session data on the server-side
const bodyParser = require('body-parser'); // Middleware for sanitizing requests
const { body, validationResult } = require('express-validator'); // middleware for sanitizing user input
const path = require('path'); // Module for working with file and directory paths
const nodemailer = require("nodemailer"); // Library for sending emails
const { v4: uuidV4 } = require('uuid'); // Library that helps with generating random ids (for the video chat urls)
const { Client } = require('pg'); // Library for connecting to the PostgreSQL database and executing SQL commands
const Matching = require('./matching.js'); // File we created with the matching algorithm

// Create Express app
const app = express();

// Connect to database
const client = new Client({
    user: 'ldqkazfnoxapti',
    host: 'ec2-18-210-90-1.compute-1.amazonaws.com',
    database: 'daboml4e3mocb8',
    password: '2c49c51d112910a43fb2d109e7120425d67b1b217000974d5fe26a20c8fc5c2c',
    port: '5432',
    ssl: {
      rejectUnauthorized: false
    }
});

client.connect();

// Configure Gmail SMTP transporter on nodemailer
const transporter = nodemailer.createTransport({
  service: "Gmail",
  auth: {
    user: process.env.EMAIL,
    pass: process.env.PASSWORD
  }
});

// Run the matching algorithm once a week:
var date = new Date();
var d = 6 - date.getDay();
var h = 24 - date.getHours();
var matches;

// Re-match everyone in the people table, send emails about the new matches
function updateMatches() {
  if (d == 0 && h == 0) {
    // Clear previous week's matches
    client.query("truncate matches")
    .catch(err => {console.log(err.stack); })
    client.query("SELECT person_id FROM people;")
    .then(result => {
      matches = Matching(result.rows);
      // Loop through all of the users
      for (var i = 0; i < matches.length; i++) {
        // Insert matches into matches table
        client.query("INSERT INTO matches(person1_id, person2_id) VALUES($1, $2);", [matches[i][0].person_id, matches[i][1].person_id])
        .catch(err => { console.log(err.stack); })

        // Generate a random video chat meeting link:
        const meetingLink = `https://cs50-final-project-video-chat.herokuapp.com/${uuidV4()}`;

        // Create an email to send to our admin address and the new match
        const mailContent = {
          from: process.env.EMAIL,
          to: `${process.env.EMAIL}, ${matches[i][0].email}, ${matches[i][1].email}`,
          subject: 'Your VirtuConnect match!',
          text: `Congratulations, ${matches[i][0].name} and ${matches[i][1].name}! You two have been matched on VirtuConnect! Please reply all to this email to schedule a meeting with your new friend. You can use this link to video chat at your chosen time: ${meetingLink}.`
        };

        // Send the email to the admin email and the match
        transporter.sendMail(mailContent, (err, data) => {
          if (err) {
            console.log(err);
          } else {
            console.log('Email sent');
          }
        });
      }
    })
    .catch(err => { console.log(err.stack); })
  }
}
setInterval(updateMatches, 604800000);

// Middleware
app.use(session({
  secret: 'okc',
  resave: true,
  saveUninitialized: true
}));
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'front-end/build')));

// Handle GET requests to any route by serving static React files
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname + '/front-end/build/index.html'))
})

// Handle POST request from register page; insert data into users table
app.post('/register', [
  // Ensure user inputs are valid
  body('name').not().isEmpty(),
  body('email').isEmail().normalizeEmail(),
  body('password').not().isEmpty(),
], (req, res) => {
  // If the user inputs are not valid, throw an error
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    console.log(errors.array());
    return res.send({ error: 'Please enter a valid name, email, and password.' });
  }

  //If the user entered all required information, proceed with registering them
  const name = req.body.name;
  const email = req.body.email;
  const password = req.body.password;

  //Query databse to ensure user doesn't already have an account with the same email address
  client.query("SELECT * FROM users WHERE email = $1", [email])
  .then(result => {
    // If the user already has an account, tell the frontend to alert the user
    if (result.rows.length > 0) {
      return res.send({ error: 'You already have an account with this email address. Please log in!' });
    } 
    //If the user doesn't already have an account, attempt to register them
    else {
      const hashedPassword = djb2_xor(password);
      client.query("INSERT INTO users(name, password, email, created_on, last_login) VALUES($1, $2, $3, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);", [name, hashedPassword, email])
      .then(result => {
        if (result.rowCount === 1) {
          res.send(JSON.stringify(result));
        } else {
          return res.send({ error: 'There was an error. Please refresh and try again.' });
        }
      })
      //If there was an error with the SQL query, send back an error message to the user
      .catch(err => { 
        console.log(err.stack);
        return res.send({ error: 'There was an error. Please refresh and try again.' });
      })
    }
  })
  //If there was an error with the request handling, send back an error message to the user
  .catch(err => {
    console.log(err.stack);
    return res.send({ error: 'There was an error. Please refresh and try again.' });
  })
})

// Handle POST request from login page; store logged in user's session -- Credit: https://codeshack.io/basic-login-system-nodejs-express-mysql/
app.post('/login', [
  // Ensure user inputs are valid
  body('email').isEmail().normalizeEmail(),
  body('password').not().isEmpty(),
], (req, res) => {
  // If the user inputs are not valid, throw an error
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    console.log(errors.array());
    return res.send({ error: 'Please enter a valid email and password.' });
  }

  // If the user entered all required information, proceed with attempting to log them in
  const email = req.body.email;
  const password = req.body.password;

  // Query the database for the entered email
  client.query("SELECT * FROM users WHERE email = $1;", [email])
  .then(result => {
    // If the user entered an email that is associated with an account, proceed by checking their password
    if (result.rows.length > 0) {
      // If the user entered the incorrect password, throw an error
      if (result.rows[0].password != djb2_xor(password)) {
        return res.send({ error: 'Incorrect password.' });
      }
      //If the user entered a correct email & password combination, proceed with logging them in
      else {
        //Update the user's session
        req.session.loggedin = true;
        req.session.user_id = result.rows[0].user_id;

        // Tell the client that the user is logged in
        return res.send({ loggedIn: true });
      }
    }
    //If the user entered an email that is not associated with an account, send back an error to the user
    else {
      return res.send({ error: 'The email you entered is not associated with an account. Please register for an account!' });
    }
  })
  //If there was an error with the SQL query, send back an error message to the user
  .catch(err => {
    console.log(err.stack);
    return res.send({ error: 'There was an error. Please refresh and try again.' });
  })
})

// Handle POST request from dashboard page; display matches in dashboard
app.post('/dashboard', (req, res) => {

  // Query the database for the user's match information based on their session and update session
  client.query("SELECT * FROM people WHERE user_id = $1", [req.session.user_id])
  .then(result => {
    if (result.rows.length > 0) {
      req.session.person_id = result.rows[0].person_id;

      // Query the database for the person_id of the user's most recent match
      client.query("SELECT * FROM matches WHERE person1_id = $1 OR person2_id = $1", [req.session.person_id])
      .then(result => {
        // If the user has been matched, query the database for the name and email of that person to display on the dashboard
        if (result.rows.length > 0) {
          var temp_id;
          // If the user was stored in the matches table as person1, we wish to find person2's, and vice versa if stored as person2
          if (result.rows[0].person1_id == req.session.person_id) {
            temp_id = result.rows[0].person2_id
          }
          else {
            temp_id = result.rows[0].person1_id
          }
          // Query the database for the name and email of the matched person to display on the user's dashboard
          client.query("SELECT name, email FROM users WHERE user_id IN (SELECT user_id FROM people WHERE person_id = $1)", [temp_id])
          .then(result => {
            if (result.rows.length > 0) {
            res.send(JSON.stringify(result.rows[0]))
            }
          })
          //If there was an error with the SQL query, send back an error message to the user
          .catch(err => {
            console.log(err.stack);
            return res.send({ error: 'There was an error. Please refresh and try again.' });
          })
        } 
        else {
          res.send(JSON.stringify(''));
        }
      })
      //If there was an error with the SQL query, send back an error message to the user
      .catch(err => {
        console.log(err.stack);
        return res.send({ error: 'There was an error. Please refresh and try again.' });
      })
    }
  })
  //If there was an error with the SQL query, send back an error message to the user
  .catch(err => {
    console.log(err.stack);
    return res.send({ error: 'There was an error. Please refresh and try again.' });
  })
})

// Handle POST request from the profile page; display previously submitted information; allow users to submit information
app.post('/profile', function(req, res) {
  // If the post request sent from profile had params.id=1, display previously submitted information
  if (req.body.params.id == 1) {
    // Query database for inputted profile information to display on the profile page
    client.query("SELECT * FROM people WHERE user_id = $1", [req.session.user_id])
    .then(result => {
      if (result.rows.length > 0) {
        // Update session with person_id
        req.session.person_id = result.rows[0].person_id;

        res.send(JSON.stringify(result.rows[0]));
      } else {
        res.send(JSON.stringify(''));
      }
    })
    //If there was an error with the SQL query, send back an error message to the user
    .catch(err => {
      console.log(err.stack);
      return res.send({ error: 'There was an error. Please refresh and try again.' });
    })
  }
  // If params.id=2, insert into or update tables in the database with submitted information
  else if (req.body.params.id == 2){
    const organization = req.body.organization;
    const address = req.body.address;
    const day = req.body.day;
    // First check if we are updating or inserting
    client.query("SELECT * FROM people WHERE user_id = $1", [req.session.user_id])
    .then(result => {
      // If the user is already in the people table, update organization and address in people
      if (result.rows.length > 0) {
        client.query("UPDATE people SET organization=$1,address=$2 WHERE user_id=$3 RETURNING *", [organization, address, req.session.user_id])
        .then(result => {
          res.send(JSON.stringify(result.rows[0]));
        })
        //If there was an error with the SQL query, send back an error message to the user
        .catch(err => {
          console.log(err.stack);
          return res.send({ error: 'There was an error. Please refresh and try again.' });
        })
        // Also update scheduling_preferences with the preferred meeting day
        client.query("UPDATE scheduling_preferences SET day_id=$1 WHERE person_id=$2", [day, req.session.person_id])
        //If there was an error with the SQL query, send back an error message to the user
        .catch(err => {
          console.log(err.stack);
          return res.send({ error: 'There was an error. Please refresh and try again.' });
        })
      }
      // Otherwise, insert a new row in people with the appropriate information about organization and address
      else {
        client.query("INSERT INTO people(organization, address, user_id) VALUES ($1, $2, $3) RETURNING *", [organization, address, req.session.user_id])
        .then(result => {
          res.send(JSON.stringify(result.rows[0]));
        })
        //If there was an error with the SQL query, send back an error message to the user
        .catch(err => {
          console.log(err.stack);
          return res.send({ error: 'There was an error. Please refresh and try again.' });
        })
        // Also insert into scheduling_preferences with the preferred meeting day
        client.query("INSERT INTO scheduling_preferences(person_id, day_id) VALUES ($1, $2)", [req.session.person_id, day])
        //If there was an error with the SQL query, send back an error message to the user
        .catch(err => {
          console.log(err.stack);
          return res.send({ error: 'There was an error. Please refresh and try again.' });
        })
      }
    })
    //If there was an error with the SQL query, send back an error message to the user
    .catch(err => {
      console.log(err.stack);
      return res.send({ error: 'There was an error. Please refresh and try again.' });
    })
  }
});

//Handle POST requests from the logout page
app.post('/logout', (req, res) => {
  //Clear the session cookies
  req.session.destroy((err) => {
    console.log(err);
  });
})

//Hash function for hashing the passwords -- credit: https://gist.github.com/eplawless/52813b1d8ad9af510d85
function djb2_xor(str) {
  let len = str.length
  let h = 5381
 
  for (let i = 0; i < len; i++) {
    h = h * 33 ^ str.charCodeAt(i)
   }
   return h >>> 0
 }

const port = process.env.PORT || 5000;
app.listen(port, () => console.log(`Listening on port ${port}...`));

// End client connection when server closes -- credit: https://hackernoon.com/graceful-shutdown-in-nodejs-2f8f59d1c357 
process.on('SIGTERM', () => {
  console.info('SIGTERM signal received.');
  console.log('Closing http server.');
  server.close(() => {
    console.log('Http server closed.');
    client.end(false, () => {
      console.log('Client connection closed.');
      process.exit(0);
    });
  });
});