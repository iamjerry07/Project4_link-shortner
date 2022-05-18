const express = require('express');
var bodyParser = require('body-parser');
const route = require('../src/route');
const app = express();
const mongoose = require('mongoose');

app.use(bodyParser.json());

mongoose.connect("mongodb+srv://anurup123:9051011794@cluster0.6ajxy.mongodb.net/anurup123")
    .then(() => console.log('MongoDb is connected'))
    .catch(err => console.log(err));

app.use('/', route);

app.listen(process.env.PORT || 3000, function () {
    console.log('Express app running on port ' + (process.env.PORT || 3000))
});