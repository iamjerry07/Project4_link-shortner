const express = require('express');
var bodyParser = require('body-parser');
const route = require('../src/route');
const app = express();
const mongoose = require('mongoose');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

mongoose.connect("mongodb+srv://rohanDb:iamjerry@cluster0.etldx.mongodb.net/url?retryWrites=true&w=majority")
    .then(() => console.log('MongoDb is connected'))
    .catch(err => console.log(err));

app.use('/', route);

app.listen(process.env.PORT || 3000, (err) => {
    console.log("Connected to port 3000")
});