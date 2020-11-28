const express = require('express'); // a framework for better handling http requests & responses
const path = require('path');
const { body, validationResult } = require('express-validator'); //set of middlewares that will help clean up user input
const bodyParser = require('body-parser');
const uuid = require('uuid');
const cors = require("cors");
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

client.connect();

// Middleware
app.use(express.json());
app.use(cors());
app.use(express.static(path.join(__dirname, 'front-end/build')));

// Serve static React files
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname + '/front-end/build/index.html'))
})

// Handle POST request from register page; insert data into users table
app.post('/register', (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    //const id = uuid.v4();
    const date = new Date().toLocaleDateString(); //need to fix this
    const query = "INSERT INTO users(name, password, email, created_on, last_login) VALUES('" + req.body.name + "','" + req.body.password + "','" + req.body.email + "','" + date + "','" + date + "');";
    client.query(query, function (error, results, fields) {
      if(error)
      {
        throw error;
      }
      client.end();

      res.send(JSON.stringify(results));
    });
})

// Handle POST request from profile page; insert data into people table
app.post('/profile', function(req,res) {
  
  console.log(req.body);

  if (req.body.organization && req.body.address) {
    let str = "INSERT INTO people(organization, address, user_id) VALUES ('"+ req.body.organization + "','" + req.body.address + "'," + 2 + ");";
    console.log(str);

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

const port = process.env.PORT || 5000;
app.listen(port, () => console.log(`Listening on port ${port}...`));