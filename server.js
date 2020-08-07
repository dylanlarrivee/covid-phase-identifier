const express = require("express");
const mongoose = require("mongoose");
const morgan = require("morgan");
const path = require("path");
const bodyParser = require('body-parser');
const fs = require('file-system');
const redis = require("redis");
require('dotenv').config()

const app = express();
var cors = require('cors');

//setup port constants
const port_redis = process.env.REDIS_PORT || 6379;
const PORT = (process.env.PORT || 3000);

//configure redis client on port 6379
const redis_client = redis.createClient(port_redis);

const scrapeHtmlRoutes = require("./routes/scrapeHtmlRoutes");
const googleMapsApiRoutes = require("./routes/googleMapsApiRoutes");

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// If the request is not coming from a browser we need an API key for security
function isAccessGranted (req, res, next) {
  // console.log(req.headers)
  if (!app.locals.origin){
    if (req.headers.apikey) {
      if(req.headers.apikey == process.env.API_KEY) {
        next();
      } else {
        res.status(401).send("Error: Invalid Token");
      }
    } else {
      res.status(401).send("Error: Missing Token");
    }  
  } else {
    next();
  }
}

// Handle CORS - Can add URLs to be whitelisted below as needed.
var whitelist = ['http://localhost:8080', 'http://localhost:3000', 'http://127.0.0.1:8080', 'http://127.0.0.1:3000', 'https://covid-phase-identifier.herokuapp.com']


var corsOptions = {
  origin: function (origin, callback) {
      if (whitelist.indexOf(origin) !== -1 || !origin ) {
        app.locals.origin = origin
        callback(null, true)
      } else {
        callback(new Error('Not allowed by CORS'))
      }
  }
}

// HTTP request logger
app.use(morgan("tiny"));

// Body parser
app.use(bodyParser.json());

app.use("/api", cors(corsOptions), isAccessGranted, scrapeHtmlRoutes);
app.use("/api", cors(corsOptions), isAccessGranted, googleMapsApiRoutes);


console.log("running in ", process.env.NODE_ENV)

// Serve up a verification token for load testing 
app.get('/loaderio-1cee83e488a3fa704972071ebb305300', function(req, res) {
  res.send('loaderio-1cee83e488a3fa704972071ebb305300') 
 });


if (process.env.NODE_ENV === 'production' || process.env.NODE_ENV === 'docker') {
  // Serve any static files
  app.use(express.static(path.join(__dirname, 'client/build')));
// Handle React routing, return all requests to React app
  app.get('*', function(req, res) {
   // res.sendFile(path.join(__dirname, 'client/build', 'index.html'));
    res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
  });
}

let server = app.listen(PORT, function () {
  console.log(`Server is starting at ${PORT}`);
});

// app.listen(PORT, console.log(`Server is starting at ${PORT}`));

module.exports = server

