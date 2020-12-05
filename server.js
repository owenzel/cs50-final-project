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

var date = new Date();
var d = 6 - date.getDay();
var h = 24 - date.getHours();
var matches;

const Matching = require('./matching.js');

if (d == 0 && h == 0) {
  // Match everyone in the people table, matches stored as object
  client.query("SELECT person_id FROM people;")
  .then(result => {
    matches = Matching(result.rows);

    // Insert matches into matches table
    for (var i = 0; i < matches.length; i++) {
      client.query("INSERT INTO matches(person1_id, person2_id) VALUES($1, $2);", [matches[i][0].person_id, matches[i][1].person_id])
      .catch(err => { console.log(err.stack); })
    }

  })
  .catch(err => { console.log(err.stack); })
}

// Middleware
app.use(session({
  secret: 'okc',
  resave: true,
  saveUninitialized: true
}));
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'front-end/build')));

// Handle POST request from register page; insert data into users table
//TODO: Add error check to make sure user doesn't already have account
app.post('/register', (req, res) => {
  const name = req.body.name;
  const email = req.body.email;
  const password = req.body.password;
  if (name && email && password)
  {
    const hashedPassword = djb2_xor(password);
    client.query("INSERT INTO users(name, password, email, created_on, last_login) VALUES($1, $2, $3, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);", [name, hashedPassword, email])
    .then(result => {
      if (result.rowCount === 1) {
        res.send(JSON.stringify(result));
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

// Display matches in dashboard
app.get('/dashboard', (req, res) => {
  client.query("SELECT * FROM matches WHERE person1_id = $1 OR person2_id = $1", [req.session.person_id])
  .then(result => {
    if (result.rows.length > 0) {
      // User has been matched, return match on the dashboard
      var temp_id;
      if (result.rows[0].person1_id == req.session.person_id) {
        temp_id = result.rows[0].person2_id
      }
      else {
        temp_id = result.rows[0].person1_id
      }
      client.query("SELECT name FROM users WHERE user_id IN (SELECT user_id FROM people WHERE person_id = $1)", [temp_id])
        .then(result => {
          if (result.rows.length > 0) {
            res.send(JSON.stringify(result.rows[0]))
          }
        })
        .catch(err => console.log(err.stack))
    } 
    else {
      res.send(JSON.stringify(''));
    }
  })
  .catch(err => console.log(err.stack))
})

app.get('/profile', (req, res) => {
  if (req.query.id) {
    client.query("SELECT * FROM people WHERE user_id = $1", [req.session.user_id])
    .then(result => {
      if (result.rows.length > 0) {
        // User has already inputted profile information, display it on the page
        req.session.person_id = result.rows[0].person_id;
      
        res.send(JSON.stringify(result.rows[0]));
      } else {
        res.send(JSON.stringify(''));
      }
    })
    .catch(err => console.log(err.stack))
  }
  else {
    res.sendFile(path.join(__dirname + '/front-end/build/index.html'))
  }
})

app.post('/profile', function(req, res) {
  const organization = req.body.organization;
  const address = req.body.address;

  // First check if we are updating or inserting
  client.query("SELECT * FROM people WHERE user_id = $1", [req.session.user_id])
  .then(result => {
    // If the user is already in the people table, then we update
    // TODO: currently can only update entire row, and not individual parts
    if (result.rows.length > 0) {
      client.query("UPDATE people SET organization=$1,address=$2 WHERE user_id=$3", [organization, address, req.session.user_id])
      .catch(err => {
        console.log(err.stack);
      })
    }
    // Otherwise, insert a new row
    else {
      const str = "INSERT INTO people(organization, address, user_id) VALUES ($1, $2, $3)"
      const values = [organization, address, req.session.user_id]

      // client.connect();
      client.query(str, values)
      .catch(err => {
        console.log(err.stack);
      })
    }
  })
  .catch(err => console.log(err.stack))
  //.then(() => client.end())
});

//Handle POST requests from the logout page
app.post('/logout', (req, res) => {
  //Clear the session cookies
  req.session.destroy((err) => console.log(err));
})

// Serve static React files
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname + '/front-end/build/index.html'))
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