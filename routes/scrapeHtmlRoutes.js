"use strict";
const express = require("express");
const router = express.Router();
const rp = require('request-promise');
const HTMLParser = require('node-html-parser');
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


router.post("/get-phase-info", (req, res) => {
  const url = 'https://coronavirus.wa.gov/what-you-need-know/safe-start/whats-open-each-phase'

rp(url)
  .then(function(html){
    res.send(html);
    let root = HTMLParser.parse(html);
  })
  .catch(function(err){
  });

});

// Change to a params to do route caching?
router.post("/get-county-status", (req, res) => {
  const url = 'https://coronavirus.wa.gov/what-you-need-know/county-status-and-safe-start-application-process'

  const custCounty = req.query.county

rp(url)
  .then(function(html){
    let root = HTMLParser.parse(html);
    // console.log(root.querySelector('.field--name-field-body-no-summary'));
    let countyBodyHtml = root.querySelector('.field--name-field-body-no-summary').toString();
    // res.send(countyBodyHtml);
    const phaseOneCounties = countyBodyHtml.split('<a href="/node/2128#Phase')[0];
    let phaseTwoCounties = countyBodyHtml.split('<a href="/node/2128#Phase')[1];
    let phaseThreeCounties = countyBodyHtml.split('<a href="/node/2128#Phase')[2];
    let phaseFourCounties = countyBodyHtml.split('<a href="/node/2128#Phase')[3];
    // Split up and push to array the phase one counties
    const phaseOneCountiesSplit = phaseOneCounties.split('<li>');
    const phaseOneCountiesArray = [];
 
    for (let i=1;i<phaseOneCountiesSplit.length;i++) {
      if (phaseOneCountiesSplit[i].includes("(")) {
        let parenIndex = phaseOneCountiesSplit[i].indexOf(" (")
        phaseOneCountiesArray.push(phaseOneCountiesSplit[i].substring(0, parenIndex))
      } else {
        let listCloseIndex = phaseOneCountiesSplit[i].indexOf("</li>")
        phaseOneCountiesArray.push(phaseOneCountiesSplit[i].substring(0, listCloseIndex))
      } 
    }

     // Split up and push to array the phase two counties
    const phaseTwoCountiesSplit = phaseTwoCounties.split('<li>');
    const phaseTwoCountiesArray = [];
 
    for (let i=1;i<phaseTwoCountiesSplit.length;i++) {
      if (phaseTwoCountiesSplit[i].includes("(")) {
        let parenIndex = phaseTwoCountiesSplit[i].indexOf(" (")
        phaseTwoCountiesArray.push(phaseTwoCountiesSplit[i].substring(0, parenIndex))
      } else {
        let listCloseIndex = phaseTwoCountiesSplit[i].indexOf("</li>")
        phaseTwoCountiesArray.push(phaseTwoCountiesSplit[i].substring(0, listCloseIndex))
      } 
    }

     // Split up and push to array the phase three counties
     const phaseThreeCountiesSplit = phaseThreeCounties.split('<li>');
     const phaseThreeCountiesArray = [];
  
     for (let i=1;i<phaseThreeCountiesSplit.length;i++) {
       if (phaseThreeCountiesSplit[i].includes("(")) {
         let parenIndex = phaseThreeCountiesSplit[i].indexOf(" (")
         phaseThreeCountiesArray.push(phaseThreeCountiesSplit[i].substring(0, parenIndex))
       } else {
         let listCloseIndex = phaseThreeCountiesSplit[i].indexOf("</li>")
         phaseThreeCountiesArray.push(phaseThreeCountiesSplit[i].substring(0, listCloseIndex))
       } 
     }

      // Split up and push to array the phase three counties
      const phaseFourCountiesSplit = phaseFourCounties.split('<li>');
      const phaseFourCountiesArray = [];
   
      for (let i=1;i<phaseFourCountiesSplit.length;i++) {
        if (phaseFourCountiesSplit[i].includes("(")) {
          let parenIndex = phaseFourCountiesSplit[i].indexOf(" (")
          phaseFourCountiesArray.push(phaseFourCountiesSplit[i].substring(0, parenIndex))
        } else {
          let listCloseIndex = phaseFourCountiesSplit[i].indexOf("</li>")
          phaseFourCountiesArray.push(phaseFourCountiesSplit[i].substring(0, listCloseIndex))
        } 
      }

    let custPhase = ""

    if (phaseOneCountiesArray.indexOf(custCounty) != -1) {
      custPhase = "1"
    }  else if (phaseTwoCountiesArray.indexOf(custCounty) != -1) {
      custPhase = "2"
    } else if (phaseThreeCountiesArray.indexOf(custCounty) != -1) {
      custPhase = "3"
    } else if (phaseFourCountiesArray.indexOf(custCounty) != -1) {
      custPhase = "4"
    } else {
      custPhase = "Oops we could not find the phase of that county."
    }

    console.log("custPhase", custPhase)
    redisData.redis_client.setex(custCounty, 3600, JSON.stringify(custPhase));
    res.status(200).send({"phase":custPhase})

    // res.send(HTMLParser.parse(phaseOneCountiesArray).innerHTML);

  })
  .catch(function(err){
    res.send(err);
  });

});

module.exports = router;