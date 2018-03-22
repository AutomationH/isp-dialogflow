var express = require('express');
var bodyParser = require('body-parser');
var app = express();
var request = require('request');
const API_AI_TOKEN = 'cc8d6f4bfc774c12a990d10f14656e5b'; // silly-name-maker agent.
const apiAiClient = require('apiai')(API_AI_TOKEN);


var port = process.env.PORT || 3000;

/**
 * To support JSON-encoded bodies.
 */
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

app.post('/', function(req,res) {
    if (req.body.result.metadata.intentName == "getMediaIntent") {
        console.log(req.body);
        console.log(req.body.originalRequest.data.message.attachments[0].payload.url);
        var imgurl = req.body.originalRequest.data.message.attachments[0].payload.url;
    } else {

    var lat = req.body.originalRequest.data.postback.data.lat;
    var long = req.body.originalRequest.data.postback.data.long;
    
    //console.log(req.body.originalRequest.data.postback.data.lat);
    //console.log(req.body.originalRequest.data.postback.data.long);
    //"https://maps.googleapis.com/maps/api/geocode/json?latlng=23.168770,79.931847&key=AIzaSyAPEp-nSzbgXSRGF1Hj0hzkPKevn3vf4z8"

    var options = { 
                method: 'GET',
                url: 'https://maps.googleapis.com/maps/api/geocode/json',
                qs: {
                    latlng: lat + "," + long,
                    key: 'AIzaSyAPEp-nSzbgXSRGF1Hj0hzkPKevn3vf4z8'
                },
                json: true
            };
        
    request(options, function (error, response, body) {
        var address = response.body.results[1].formatted_address;
        res.json({
            messages: [
                {
                    "type": 0,
                    "platform": "facebook",
                    "speech": "Your selected location is " + address + ". We are checking internet connection in your area." 
                }
            ]
        });

//    var ticket = Math.random()*100000000000000000;
//     res.json({
//     messages: [
//         {
//             "type": 0,
//             "platform": "facebook",
//             speech: "We recieved your location details and now we are checking the internet connection in your area."
//         },/*,
//         {
//         "type": 0,
//         speech: "We registered your issue and your ticket number is " + ticket + ". Thank you for connecting with us."
//     }*/
//         {
//             "type": 4,
//             "platform": "facebook",
//             "attachment": {
//                 "type":"template",
//                 "payload": {
//                     "template_type": "generic",
//                     "title":"Welcome to ISP solutions.",
//                     "image_url": "",
//                     "subtitle": "",
//                     "buttons": [
//                         {
//                             "type": "payload",
//                             "title": "Register issue",
//                             "payload": "register issue"
//                         },
//                         {
//                             "type": "web_url",
//                             "title": "watch video in youtube"
//                         },
//                         {
//                             "type": "postback",
//                             "title": "contact us",
//                             "payload": "contact_us"
//                         }
//                     ]
//                 }
//             }
//         }
//     ]
// // res.json({
// //     speech: req.body.result.resolvedQuery
// // });
    });
    }
});

app.listen(port);