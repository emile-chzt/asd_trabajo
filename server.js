//load the express package and create our app
var express = require("express"); // call express
var app = express(); // define our app using express
var bodyParser = require("body-parser"); // get body-parser
var path = require("path");

// get the http and filesystem modules
var http = require("http");

/*MYSQL connection*/
var connection = require("express-myconnection"),
  mysql = require("mysql");

app.use(
  connection(
    mysql,
    {
      host: "localhost",
      user: "root",
      password: "",
      port: 3306, //port mysql
      database: "testdb2",
      timezone: "utc",
      debug: false, //set true if you wanna see debug logger
    },
    "request"
  )
);

// APP CONFIGURATION ==================
// ====================================
// use body parser so we can grab information from POST requests
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
// configure our app to handle CORS requests
app.use(function (req, res, next) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "X-Requested-With,content-type, Authorization"
  );
  res.setHeader("Cache-Control", "no-transform");
  next();
});

app.use(express.static(__dirname + "/public"));

// API ROUTES ------------------------
var apiRoutes = require("./app/routes/api")(app, express);
app.use("/api", apiRoutes);

app.get("*", function (req, res) {
  res.sendFile(path.join(__dirname + "/public/views/index.html"));
});

//start the server
app.listen(8080);

// tell ourselves what's happening
console.log("Visit me at http://localhost:8080");
