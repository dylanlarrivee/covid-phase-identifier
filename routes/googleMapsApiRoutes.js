"use strict";
const express = require("express");
const router = express.Router();
const axios = require('axios');

const redis = require("redis");
const port_redis = process.env.REDIS_PORT || 6379;

const redisData = {
  redis_client: ""
}

if (process.env.NODE_ENV === 'production') {
  // Configure using the REDIS_URL
  redisData.redis_client = redis.createClient(process.env.REDIS_URL);
  } else {
  //configure redis client on port 6379
  redisData.redis_client = redis.createClient(port_redis);
  }

require('dotenv').config()

const GEOCODER_API_KEY = process.env.GEOCODER_API_KEY; 

router.post("/get-county-from-zip", (req, res) => {

  const custData = {
      zipCode:req.query.zipcode,
      county: "",
      state: "",
      zipRequestStatus: ""
  }
  axios({
    url: "https://maps.googleapis.com/maps/api/geocode/json?key=" + GEOCODER_API_KEY + "&components=postal_code:" + custData.zipCode,
    method: "GET",
  })
    .then((data) => {
      console.log("address data", data.data);
      custData.zipRequestStatus = data.data.status;

      if (data.data.status === "OK") {
        const fullCounty = data.data.results[0].address_components[2].long_name;
        custData.county = fullCounty.replace(" County", "");  
        custData.state = data.data.results[0].address_components[3].short_name; 
      }
      //add data to Redis
      redisData.redis_client.setex(custData.zipCode, 3600, JSON.stringify(custData));
        res.status(200).send({custData})
        })
    .catch((error) => {
      console.log(error);
    });



});

module.exports = router;