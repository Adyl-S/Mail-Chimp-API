// jshint esversion:6

//ExpressJS is a prebuilt Nodejs framework that can develop quicker and intelligent web applications on the server-side.
const express = require("express");

//This helps to read the body and then parse that into a Json object that we can understand.
const bodyParser = require("body-parser");

//https is a Internet protocol for secure and private online communication between user and website.
const https = require("https");


//
const request = require("request");

//we are just changing name from express to app.
const app = express();

// ye encoded url k liye hai like kisine encrypted data send kiya apne server pe to apneko wo data ka access karneke liye use karte.
app.use(bodyParser.urlencoded({
  extended: true
}));

//It is used to load static files
app.use(express.static("public"));

//get request by client and we are send html file as response.
app.get("/", function(req, res) {
  res.sendFile(__dirname + "/signup.html");
});

//send request by server to client to get data from inputs.
app.post("/", function(req, res) {
  const firstName = req.body.fname;
  const lastName = req.body.lname;
  const email = req.body.email;

  //this is the format given by mail chimp to send data to api.
  // As we are getting data like names, emails we are sending it to api to save it.
  const data = {
    members:[
      {
        email_address: email,
        status: "subscribed",
        merge_fields: {
          FNAME: firstName,
          LNAME: lastName,
        }
      }
    ]
  };

  // we are changing format of data to stringify.
  const jsonData = JSON.stringify(data);

  const url = "https://us14.api.mailchimp.com/3.0/lists/64527b3418";

  //options can be anything protocol, port , agent, key, method,etc
  const options = {
    method: "POST",
    auth : "key:2494ac0c724ecaf7c7ce4154c96ca36d-us14",
  };

  // this is a request from server to api to get data from external server of api.
  // In this some data is collected by client and some from api
  // In return of api response we are sending html files basis of statusCode.
  // we have to send this file to client so that we are using res rather than response.
  const request = https.request(url, options, function(response) {

    if (response.statusCode === 200) {
      res.sendFile(__dirname + "/success.html");
    } else {
      res.sendFile(__dirname + "/failure.html");
    }

    //getting data from response of api server and consoling it.
    response.on("data", function(data) {
      console.log(JSON.parse(data));
    });

  });

  // sending data that we got from client i.e emails & Names.
  request.write(jsonData);
  request.end();
});

//if there is problem failure page will be shown and by clicking on button it will redirect it to root page.
app.post("/failure", function(req, res) {
  res.redirect("/");
});

// heroku port i.e process.env.PORT
app.listen(process.env.PORT || 3000, function() {
  console.log("server started at port 3000");
});

//api key: 2494ac0c724ecaf7c7ce4154c96ca36d-us14
// audience id :64527b3418
