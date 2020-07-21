"use strict";
const express = require("express");
const router = express.Router();

// const storeStatusData = {
//     storeStatus:true
// }

// const {
//   StoreInfo
// } = require("../models/storeStatusModel");
// const StoreInfo = require("../models/storeInfoModel");

// router.post("/get-store-status", (req, res) => {
//   const storeStatusStoreId = req.body.storeId;
//   const storeStatuscompanyId = req.body.companyId;
//   console.log("storeStatuscompanyId", storeStatuscompanyId)
//     console.log("get-store-status");
//     StoreInfo
//         .find({
//           storeId: storeStatusStoreId,
//           companyId:storeStatuscompanyId
//          })
//         .then((data) => {
//           console.log("data:", data)   
//           let storeStatusPayload = data[0].storeStatus;
//           if (data.length !==0) {
//             res.status(200).send({storeStatusPayload})
//             console.log("found store data:", data[0].storeStatus)
//           } else {
//             //TODO add error message that the store is not valid
//           }
//         })
//         .catch((error) => {
//           res.status(500).send({getStoreErrorMessage:error}) 
//           console.log("Error", error);
//         });
//   });

  

  module.exports = router;