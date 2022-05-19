const mongoose = require('mongoose')
//const ObjectID=mongoose.Schema.
const urlModel = new mongoose.Schema({
    longUrl: {
        type: String,
        required: true,
        trim: true
    },
    shortUrl: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
     urlCode: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true
    }

});
module.exports = mongoose.model('url', urlModel)