const mongoose= require('mongoose')
const urlModel= require('../model/urlModel')
const shortid = require('shortid');

const postUrl= async function (req,res){

    try{
    let userData= req.body.url
    let user= req.body

    if(!(Object.keys(user).length || user==null || user== undefined)){
        res.status(400).send( {status: false, message: "Type a key==> (link) and value ==> (your URL) to shorten"})
    }
    if(!userData){
        res.status(400).send( {status: false, message: "Give any url to shorten"})
    }
    // if(!(/^(http:\/\/www\.|https:\/\/www\.|http:\/\/|https:\/\/)?[a-z0-9]+([\-\.]{1}[a-z0-9]+)*\.[a-z]{2,5}(:[0-9]{1,5})?(\/.*)?$/.test(userData))){
    //     return res.status(400).send( {status: false, message: "Give a valid url"})
    // }
    if(!(/^(?:http(s)?:\/\/)?[\w.-]+(?:\.[\w\.-]+)+[\w\-\._~:/?#[\]@!\$&'\(\)\*\+,;=.]+$/.test(userData))){
        return res.status(400).send( {status: false, message: "Give a valid url"})
    }

    let shortID= (shortid.generate(userData)) 
    let short = "http://localhost:3000/" + shortID

    let obj= {longUrl:userData,shortUrl:short,urlCode:shortID}

    res.send({data:obj})
} 
catch (error) {
    res.status(500).send({ status: false, message: error.message })

 
}}


module.exports.postUrl=postUrl