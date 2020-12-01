const express = require('express'); // a framework for better handling http requests & responses
const session = require('express-session');
const path = require('path');
//const { body, validationResult } = require('express-validator'); //set of middlewares that will help clean up user input
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const app = express();

//Connecting to database
const { Client } = require('pg');

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
//TODO: Standardize the format to match that of login
app.post('/register', (req, res) => {
  const name = req.body.name;
  const email = req.body.email;
  const password = req.body.password;
  if (name && email && password)
  {
    const hashedPassword = djb2_xor(password);
    //client.connect();
    client.query("INSERT INTO users(name, password, email, created_on, last_login) VALUES($1, $2, $3, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);", [name, hashedPassword, email])
    .then(result => {
      if (result.rows.length > 0) {
        res.send(JSON.stringify(results));
      } else {
        res.status(400).json({error: 'Error connecting with the database'});
      }
    })
    .catch(err => {
      console.log(err.stack);
      res.redirect('/register');
    })
    // .then(() => client.end())
  }
})

// Handle POST request from login page; store logged in user's session -- Credit: https://codeshack.io/basic-login-system-nodejs-express-mysql/
app.post('/login', (req, res) => {
  const email = req.body.email;
  const password = req.body.password;
  if (email && password) {
    //client.connect();
    client.query("SELECT * FROM users WHERE email = $1;", [email])
    .then(result => {
      if (result.rows.length > 0) {
        if (result.rows[0].password != djb2_xor(password)) {
          res.status(400).json({error: 'Incorrect password'});
          return res.redirect('/');
        } else { //If the user entered a correct email & password combination
          //TODO: update the last logged in field in the users table
          req.session.loggedin = true;
          req.session.email = email;
          console.log('logged in: ' + req.session.loggedin);

          req.session.user_id = result.rows[0].user_id;

          res.send({loggedIn: true});
        }
      } else {
        res.status(400).json({error: 'Incorrect email'});
      }
    })
    .catch(err => console.log(err.stack))

    /* 
      Commented this part out and connecting the client in the individual page in order to reuse the client 
      (else received "Client was closed and is not queryable" error) 
      Currently, client is instead closed upon filling in the profile form, but would probably be better to close when logging out
    */

    // .then(() => client.end())
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