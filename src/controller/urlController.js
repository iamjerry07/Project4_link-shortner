const urlModel = require('../model/urlModel')
const shortId = require('shortid');
const redis = require("redis");

const { promisify } = require("util");

//Connect to redis
const redisClient = redis.createClient(
    15831,
    "redis-15831.c212.ap-south-1-1.ec2.cloud.redislabs.com",
    { no_ready_check: true }
);
redisClient.auth("0M2ugGvyk1XBbAIlrKLaAMwiXDWDrnpU", function (err) {
    if (err) throw err;
});

redisClient.on("connect", async function () {
    console.log("Connected to Redis..");
});



//1. connect to the server
//2. use the commands :

//Connection setup for redis

const SET_ASYNC = promisify(redisClient.SET).bind(redisClient);
const GET_ASYNC = promisify(redisClient.GET).bind(redisClient);

const isValidURL = function(link) {
    return (/^(http:\/\/www\.|https:\/\/www\.|http:\/\/|https:\/\/)?[a-z0-9]+([\-\.]{1}[a-z0-9]+)*\.[a-z]{2,5}(:[0-9]{1,5})?(\/.*)?$/.test(link));
}

const createUrl = async (req, res) => {
    try {
        if (Object.keys(req.body).length == 0)
            return res.status(400).send({ status: false, message: "Invalid request parameters" })

        let longUrl = req.body.longUrl

        // ---------validating longUrl---------
        if (!longUrl) return res.status(400).send({ status: false, message: "Please provide a longUrl" })
        if (!isValidURL(longUrl)) return res.status(400).send({ status: false, message: "Invalid URL" })

        // ---------finding urlData in cache-------
        const cacheUrlData = await GET_ASYNC(`${longUrl}`)
        if (cacheUrlData) return res.status(200).send({ status: true, data: JSON.parse(cacheUrlData) })

        // ---------finding urlData in DB----------
        let isURLPresent = await urlModel.findOne({ longUrl }).select({ _id: 0, longUrl: 1, shortUrl: 1, urlCode: 1 })
        if (isURLPresent) {
            // -------setting urlData in cache-------
            await SET_ASYNC(`${longUrl}`, JSON.stringify(isURLPresent))
            return res.status(200).send({ status: true, data: isURLPresent })
        }

        // ----------creating urlCode and shortUrl-------
        let baseUrl = 'http://localhost:3000'
        let urlCode = shortId.generate().toLowerCase()
        let shortUrl = baseUrl + '/' + urlCode

        await urlModel.create({ longUrl, shortUrl, urlCode })

        res.status(201).send({ status: true, message: "url created successfully", longUrl, shortUrl, urlCode })
    }
    catch (err) {
        res.status(500).send({ Error: err.message })
    }
}

// const postUrl = async function (req, res) {

//     try {
//         let userData = req.body.longUrl
//         let user = req.body

//             if (!(Object.keys(user).length || user == null || user == undefined)) {
//                 return res.status(400).send({ status: false, message: "Type a key==> (longUrl) and value ==> (your URL) to shorten" })
//             }
//             // if(!userData){
//             //    return res.status(400).send( {status: false, message: "Give any url to shorten"})
//             // }
//             if (!(/^(http:\/\/www\.|https:\/\/www\.|http:\/\/|https:\/\/)?[a-z0-9]+([\-\.]{1}[a-z0-9]+)*\.[a-z]{2,5}(:[0-9]{1,5})?(\/.*)?$/.test(userData))) {
//                 return res.status(400).send({ status: false, message: "Give a valid url" })
//             }
//             // if(!(/^(?:http(s)?:\/\/)?[\w.-]+(?:\.[\w\.-]+)+[\w\-\._~:/?#[\]@!\$&'\(\)\*\+,;=.]+$/.test(userData))){
//             //     return res.status(400).send( {status: false, message: "Give a valid url"})
//             // }

//             let shortID = (shortid.generate(userData)).toLowerCase()
//             let short = "http://localhost:3000/" + shortID

//             let obj = { longUrl: userData, shortUrl: short, urlCode: shortID }

//             let createdUrl = await urlModel.create(obj)
//             return res.status(201).send({ status: true, data: createdUrl })
//         } 
// catch (error) {
//             return res.status(500).send({ status: false, message: error.message })
//         }
//     }



const getUrl = async function (req, res) {
    let data = req.params.urlCode

    let cahcedData = await GET_ASYNC(`${data}`)
    let value = JSON.parse(cahcedData)
    if (value) {
       return res.status(302).redirect(value.longUrl)
    } else {

        let gotUrl = await urlModel.findOne({ urlCode: data })

        if (!gotUrl) {
            res.status(400).send({ status: false, message: "longUrl is not present for this shortID" })
        }
        await SET_ASYNC(`${data}`, JSON.stringify(gotUrl))
        return res.status(302).redirect(gotUrl.longUrl)
    }
}




// module.exports.postUrl = postUrl
module.exports.getUrl = getUrl
module.exports.createUrl = createUrl