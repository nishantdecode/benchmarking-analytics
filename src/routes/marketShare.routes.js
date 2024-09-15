const express = require("express");
const { MarketShareController } = require("../controllers/marketShare.controllers");
const router = express.Router();

//get requests
router.get("/",MarketShareController.getAll)
router.get("/years",MarketShareController.getAllYears)

//post requests
router.post("/individualBank",MarketShareController.getIndividualBankData)
router.post("/create",MarketShareController.create)
router.post("/multipleBank",MarketShareController.getMultipleBankData)

//put requests

//patch requests

//delete requests

//customScripts

module.exports.MarketShareRouter = router;
