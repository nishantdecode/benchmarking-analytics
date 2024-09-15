const express = require("express");
const { FetchBankDataController } = require("../controllers/fetchBankData.controllers");
const router = express.Router();

//get requests
router.get("/:id", FetchBankDataController.fetchBankAndUpdate);

//post requests

//put requests

//patch requests

//delete requests

//customScripts

module.exports.FetchBankDataRouter = router;
