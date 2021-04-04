
// jshint esversion: 6
const express = require("express");
const bodyParser = require("body-parser");
const request = require("request");
const https = require("https");

const app = express();

app.use(express.static("public"));

app.use(bodyParser.urlencoded({
  extended: true
}));
require('dotenv').config();


app.get("/", function(req, res) {
  res.sendFile(__dirname + "/signup.html");
});

app.post("/", function(req, res) {

  const firstName = req.body.firstName;
  const lastName = req.body.lastName;
  const email = req.body.email;

  const data = {
    members: [{   //refer the video for a brief understanding of this object....
      email_address: email,
      status: "subscribed",
      merge_fields: {
        FNAME: firstName,
        LNAME: lastName
      }
    }]
  };

  const jsonData = JSON.stringify(data);

  const api = process.env.APIKEY;
  const listId = process.env.listId;
  const url = "https://us7.api.mailchimp.com/3.0/lists/" + listId;
  const options = {
    method: "POST",
    auth: "Syed1:"+ api
  };

  const request = https.request(url, options, function(response){

    if (response.statusCode == 200) {
      res.sendFile(__dirname + "/success.html");
    } else {
      res.sendFile(__dirname + "/failure.html");
    }

    response.on("data", function(data){
     console.log(JSON.parse(data));

    });
  });

  request.write(jsonData);
  request.end();

});


app.post("/failure",function(req,res){

  res.redirect("/");
});


//appid
// 0352234c6f48baaead31192c95243986-us7

//list id
// ae6c3c6760



app.listen(process.env.PORT || 3000, function(req, res) {
  console.log("Server is running on port 3000");
});
