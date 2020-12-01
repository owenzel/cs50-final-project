const express = require('express'); // a framework for better handling http requests & responses
const session = require('express-session');
const path = require('path');
//const { body, validationResult } = require('express-validator'); //set of middlewares that will help clean up user input
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const app = express();

//Connecting to database
const { Client } = require('pg');
const e = require('express');

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

//Connect to the database
client.connect();

// Middleware
app.use(session({
  secret: 'okc',
  resave: true,
  saveUninitialized: true
}));
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'front-end/build')));

// Serve static React files
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname + '/front-end/build/index.html'))
})

// Handle POST request from register page; insert data into users table
//TODO: Add error check to make sure user doesn't already have account
app.post('/register', (req, res) => {
  console.log('received post request');
  const name = req.body.name;
  const email = req.body.email;
  const password = req.body.password;
  if (name && email && password)
  {
    const hashedPassword = djb2_xor(password);
    client.query("INSERT INTO users(name, password, email, created_on, last_login) VALUES($1, $2, $3, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);", [name, hashedPassword, email])
    .then(result => {
      if (result.rowCount === 1) {
        res.send(JSON.stringify(results));
      } else {
        res.status(400).send('Error connecting with the database');
      }
    })
    .catch(err => { console.log(err.stack); })
  } else {
    res.status(400).send('Server error.');
  }
})

// Handle POST request from login page; store logged in user's session -- Credit: https://codeshack.io/basic-login-system-nodejs-express-mysql/
app.post('/login', (req, res) => {
  const email = req.body.email;
  const password = req.body.password;
  if (email && password) {
    client.query("SELECT * FROM users WHERE email = $1;", [email])
    .then(result => {
      if (result.rows.length > 0) {
        if (result.rows[0].password != djb2_xor(password)) {
          return res.status(400).send('Incorrect password');
        } else { //If the user entered a correct email & password combination
          //TODO: update the last logged in field in the users table
          req.session.loggedin = true;
          req.session.email = email;
          console.log('logged in: ' + req.session.loggedin);

          req.session.user_id = result.rows[0].user_id;

          res.send({loggedIn: true, email: email});
        }
      } else {
        res.status(400).send('Incorrect email');
      }
    })
    .catch(err => console.log(err.stack))
  }
})

// TODO: Handle GET request from profile page: if already filled out display current data, can update information if they want, otherwise display form

// Handle POST request from profile page; insert data into people table
app.post('/profile', function(req,res) {
  
  // console.log(req.body);
  const organization = req.body.organization;
  const address = req.body.address;

  if (organization) {
    const str = "INSERT INTO people(organization, address, user_id) VALUES ($1, $2, $3)"
    const values = [organization, address, req.session.user_id]

    // client.connect();
    client.query(str, values)
    .catch(err => {
      console.log(err.stack);
      res.redirect('/dashboard');
    })
    .then(() => client.end())
  }
});

//Handle POST requests from the logout page
app.post('/logout', (req, res) => {
  //Clear the session cookies
  req.session.destroy((err) => console.log(err));
})

//Hash function -- credit: https://gist.github.com/eplawless/52813b1d8ad9af510d85
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

// TODO: end client connection when server closes
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