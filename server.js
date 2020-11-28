const express = require('express'); // a framework for better handling http requests & responses
const path = require('path');
const { body, validationResult } = require('express-validator'); //set of middlewares that will help clean up user input
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

app.use(express.json());
app.use(cors());
app.use(express.static(path.join(__dirname, 'front-end/build')))

// Test route:
//app.get('/', (req, res) => {
    //res.send('Hello World');
    //res.sendFile(path.join(__dirname, "public", "index.html"));
//})

app.get('/dbtest', (req, res) => {
  client.query('SELECT * FROM users;', (err, res) => {
    if (err) throw err;
    for (let row of res.rows) {
      console.log(JSON.stringify(row));
    }
    client.end();
  });
})

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname + '/front-end/build/index.html'))
})

// Test route -- communicates with React
app.post('/', (req, res) => {
  console.log(req.body);
})

// Test route:
// app.post('/test', [body('text').not().isEmpty().trim()], (req, res) => {
//     const errors = validationResult(req);
//     if (!errors.isEmpty()) {
//       return res.status(400).json({ errors: errors.array() });
//     }
// })

const port = process.env.PORT || 5000;
app.listen(port, () => console.log(`Listening on port ${port}...`));

// /express-static-serve --> /server --> npm init
// /public --> index.html and /js and /css --> script.js and styles.css
// index.js
// /express-static-serve --> /react-app