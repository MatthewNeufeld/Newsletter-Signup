const express = require("express");
const bodyParser = require("body-parser");
const request = require("request");
const https = require("https");

const app = express();

app.use(express.static("public"));
app.use(bodyParser.urlencoded({
  extended: true
}));

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/signup.html");
});

//make a post request when signup button is pressed
app.post("/", (req, res) => {

  //bodyParser to attain user info
  const firstName = req.body.first;
  const lastName = req.body.last;
  const email = req.body.email;

  //this is the object that is sent to the Mailchimp servers
  const data = {

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
  const url = "https://us21.api.mailchimp.com/3.0/lists/08e2d5d766";
  options = {
    method: "POST",
    auth: "username:af2fbaf67f2958399017264d11c388b3-us21"
  }

  const request = https.request(url, options, (response) => {

    //a status code of 200 means that everything works properly.
    //when everything works properly, send send success.html
    //otherwise, send failure.html
    if (response.statusCode === 200)
      res.sendFile(__dirname + "/success.html");
    else
      res.sendFile(__dirname + "/failure.html");

    response.on("data", (data) => {
      console.log(JSON.parse(data));

    });
  });

  request.write(jsonData);
  request.end();

});

//when the 'try again' button is pressed on the failure page, user will be
//redirected to initial signup page
app.post("/failure", (req, res) => {
  res.redirect("/");
});

app.listen(3000, () => {
  console.log("Server running on port 3000.");
});
