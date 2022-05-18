const mongoose= require('mongoose')
const urlModel= require('../model/urlModel')
const shortid = require('shortid');

const postUrl= async function (req,res){

    try{
    let userData= req.body.longurl
    let user= req.body

    if(!(Object.keys(user).length || user==null || user== undefined)){
      return  res.status(400).send( {status: false, message: "Type a key==> (longUrl) and value ==> (your URL) to shorten"})
    }
    if(!userData){
       return res.status(400).send( {status: false, message: "Give any url to shorten"})
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

    let createdUrl= await urlModel.create(obj)
   return res.status(201).send({status:true,data:createdUrl})
} 
catch (error) {
   return res.status(500).send({ status: false, message: error.message })
}}


const getUrl= async function(req,res){
    let data= req.params.urlCode
    if(!data){
        return res.status(400).send( {status: false, message: "Give shortUrl in params"})
    }
    let gotUrl= await urlModel.findOne({urlCode:data}).select({longUrl:1,_id:0})
    if(!gotUrl){
        res.status(400).send( {status: false, message: "longUrl is not present for this shortID"})
    }
   return res.status(201).send(gotUrl)
}


module.exports.postUrl=postUrl
module.exports.getUrl=getUrl