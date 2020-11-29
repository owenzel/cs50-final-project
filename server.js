const secret = 'mysecretsshhh';

const express = require('express'); // a framework for better handling http requests & responses
const path = require('path');
const { body, validationResult } = require('express-validator'); //set of middlewares that will help clean up user input
const bodyParser = require('body-parser');
const cors = require("cors");
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
const withAuth = require('./middleware');
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
app.use(express.urlencoded({ extended: false }))
app.use(express.json());
app.use(cors());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'front-end/build')));

app.get('/checkToken', withAuth, function(req, res) {
  res.sendStatus(200);
});

//Test:
app.get('/secret', withAuth, function(req, res) {
  console.log('The password is potato');
  res.send('The password is potato');
});

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
    client.query(query, [req.body.name, hashedPassword, req.body.email, date, date], function (error, results, fields) {
      if(error)
      {
        throw error;
      }
      client.end();

      res.send(JSON.stringify(results));
    });
  } catch (err) {
    res.redirect('/register')
  }
})

//TODO: Handle POST requests for the login page -- make sure the user exists, store in the session, and update the last logged in field in the users table
app.post('/login', async (req, res) => {
  try {
      //query the database for the user's entered log in information
      client.connect();
      const user = await client.query("SELECT * FROM users WHERE email = $1;", [req.body.email]);
      client.end();

     // if there is no user with the given email address, throw an error
      if (!user) {
       res.status(400).json({error: 'Incorrect email'});
      } else { //if there is a user with the given email address, make sure they entered the correct 
        if (user.rows[0].password != djb2_xor(req.body.password)) {
         res.status(401).json({error: 'Incorrect email or password'});
        } else {
          // Issue token
          const payload = { email: user.rows[0].email };
          const token = jwt.sign(payload, secret, {
            expiresIn: '1h'
          });
          res.cookie('token', token, { httpOnly: true }).sendStatus(200);
        }
    }
  } catch (err) {
    res.redirect('/login')
  }
})

// Handle POST request from profile page; insert data into people table
app.post('/profile', function(req,res) {
  
  console.log(req.body);

  if (req.body.organization && req.body.address) {
    let str = "INSERT INTO people(organization, address, user_id) VALUES ('"+ req.body.organization + "','" + req.body.address + "'," + 2 + ");";
    console.log(str);
    client.connect();
    client.query(str, function (error, results, fields) {
      if(error) throw error;
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