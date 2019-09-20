//jshint esversion:  6

const express = require("express");
const bodyParser = require("body-parser");
const request = require("request");

const app = express();

//Allows the use of static folders
app.use(express.static("public"));
app.use(bodyParser.urlencoded({
  extended: true
}));

app.get("/", function(req, res) {
  res.sendFile(__dirname + "/signup.html");
});

app.post("/", function(req, res) {
  var firstName = req.body.firstName;
  var lastName = req.body.lastName;
  var email = req.body.email;

  var data = {
    members: [{
      email_address: email,
      status: "subscribed",
      merge_fields: {
        FNAME: firstName,
        LNAME: lastName
      }
    }]
  };

  var jsonData = JSON.stringify(data);

  var api_key = process.env.API_KEY;

  var options = {
    url: "https://us20.api.mailchimp.com/3.0/lists/97189cb54a",
    method: "POST",
    headers: {
      "Authorization": api_key
    },
    body: jsonData
  };

  request(options, function(error, response, body) {
    if (error) {
      res.sendFile(__dirname + "/failure.html");
    } else {
      if (response.statusCode === 200) {
        res.sendFile(__dirname + "/success.html");
      } else {
        res.sendFile(__dirname + "/failure.html");
      }
    }
  });


});

app.post("/failure", function(req, res) {
  res.redirect("/");
});

app.listen(process.env.PORT || 3000, function() {
  console.log("Server is running on port 3000.");
});

// API Key
// 26cab0d1c2f560bf3ac65e01d4e633ec-us20

//List ID
// 97189cb54a
