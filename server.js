const express = require('express'); // a framework for better handling http requests & responses
const path = require('path');
const { body, validationResult } = require('express-validator'); //set of middlewares that will help clean up user input
const cors = require("cors");
const app = express();

app.use(express.json());
app.use(cors());
//app.use(express.static(path.join(__dirname, 'front-end/build')));

// Test route:
app.get('/', (req, res) => {
    //res.send('Hello World');
    //res.sendFile(path.join(__dirname, 'front-end/build', 'index.html'));
    res.send({ message: "We did it!" });

})

// Test route -- communicates with React
app.post('/', (req, res) => {
  console.log(req.body);
})

// Test route:
app.post('/test', [body('text').not().isEmpty().trim()], (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
})

const port = process.env.PORT || 8080;
app.listen(port, () => console.log(`Listening on port ${port}...`));