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

// Middleware
app.use(session({
  secret: 'okc',
  resave: true,
  saveUninitialized: true
}));
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'front-end/build')));

//For login testing:
app.get('/test', (req, res) => {
  if (req.session.loggedin) {
    res.send('Welcome back, ' + req.session.email);
  } else {
    res.send('Please log in to view this page!');
  }
  res.end();
})

// Serve static React files
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname + '/front-end/build/index.html'))
})

// Handle POST request from register page; insert data into users table
app.post('/register', async (req, res) => {
  try {
    const date = new Date().toLocaleDateString(); //need to fix this
    const hashedPassword = djb2_xor(req.body.password);
    const query = "INSERT INTO users(name, password, email, created_on, last_login) VALUES($1, $2, $3, $4, $5);";
    client.connect();
    client.query(query, [req.body.name, hashedPassword, req.body.email, date, date], (error, results, fields) => {
      if(error)
      {
        throw error;
      }
      res.send(JSON.stringify(results));
    }); client.end();
  } catch (err) {
    res.redirect('/register')
  }
})

// Handle POST request from login page; store logged in user's session -- Credit: https://codeshack.io/basic-login-system-nodejs-express-mysql/
app.post('/login', (req, res) => {
  const email = req.body.email;
  const password = req.body.password;
  if (email) {
    client.connect();
    client.query("SELECT * FROM users WHERE email = $1;", [email])
    .then(result => {
      console.log(result);
      if (result.rows.length > 0) {
        if (result.rows[0].password != djb2_xor(password)) {
          res.status(400).json({error: 'Incorrect password'});
          return res.redirect('/');
        } else { //If the user entered a correct email & password combination
          //TODO: update the last logged in field in the users table
          req.session.loggedin = true;
          req.session.email = email;
          console.log('logged in');
          res.redirect('/');
        }
      } else {
        res.status(400).json({error: 'Incorrect email'});
      }
    })
    .catch(err => console.log(err.stack))
    .then(() => client.end())
  }
})

// Handle POST request from profile page; insert data into people table
app.post('/profile', function(req,res) {
  
  console.log(req.body);

  if (req.body.organization && req.body.address) {
    let str = "INSERT INTO people(organization, address, user_id) VALUES ('"+ req.body.organization + "','" + req.body.address + "'," + 2 + ");";
    console.log(str);
    client.connect();
    client.query(str, (error, results, fields) => {
        if (error)
          throw error;
        client.end();

        res.send(JSON.stringify(results));
      });
  }
});

// // Test database
// app.get('/dbtest', (req, res) => {
//   client.query('SELECT * FROM users;', (err, res) => {
//     if (err) throw err;
//     for (let row of res.rows) {
//       console.log(JSON.stringify(row));
//     }
//     client.end();
//   });
// })

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