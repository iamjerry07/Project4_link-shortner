const express = require('express')
const router = express.Router();
const urlController= require('../src/controller/urlController')


// router.post('/url/shorten', urlController.postUrl)

router.post('/url/shorten', urlController.createUrl)

router.get('/:urlCode', urlController.getUrl)

module.exports= router