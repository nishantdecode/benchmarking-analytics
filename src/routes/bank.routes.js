const express = require("express");
const { BankController } = require("../controllers/bank.controllers");
const router = express.Router();

//get requests
router.get("/",BankController.getAllBanks);
router.get("/remove",BankController.removeExtraction);
router.get("/:bankId",BankController.getBank);

//post requests
router.post("/create",BankController.create);
router.post("/extract",BankController.requestExtraction);

//put requests
router.put("/:bankId",BankController.updateBank);

//patch requests

//delete requests


//customScripts

module.exports.BankRouter = router;
