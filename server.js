const express = require('express'); // a framework for better handling http requests & responses
const { body, validationResult } = require('express-validator'); //set of middlewares that will help clean up user input
const app = express();

app.use(express.json());

// Test route:
app.get('/', (req, res) => {
    res.send('Hello World');
})

// Test route:
app.post('/test', [body('text').not().isEmpty().trim()], (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
})

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on port ${port}...`));