const express = require('express');
const bodyParser = require('body-parser');


// create express app
const app = express();

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }))

// parse application/json
app.use(bodyParser.json())

// Configuring the database
const dbConfig = require('./config/db');
const mongoose = require('mongoose');

mongoose.Promise = global.Promise;

mongoose.connect(dbConfig.url, {})
    .then(() => {
        console.log("Successfully connected to the database");
    }).catch(err => {
        console.log('Could not connect to the database. Exiting now...', err);
        process.exit();
    });

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,PATCH,DELETE');
    res.setHeader('Access-Control-Allow-Methods', 'Content-Type', 'Authorization');
    next();
})

require('./app/routes/user.routes')(app);
require('./app/routes/card.routes')(app);
require('./app/routes/auth.routes')(app);

app.get("/", function (_req, res) {
    return res.send("El servidor esta funcionando");
});

// listen for requests
app.listen(3000, () => {
    console.log("Server is listening on port 3000");
});