const express = require("express");
const { CommonSizeController } = require("../controllers/commonSize.controllers");
const router = express.Router();

//get requests
router.get("/",CommonSizeController.getAll)

//post requests
router.post("/create",CommonSizeController.create)
router.post("/multipleBank",CommonSizeController.getSizeOfBanks)
router.post("/individualBank",CommonSizeController.getSizeByBank)

//put requests

//patch requests

//delete requests

//customScripts

module.exports.CommonSizeRouter = router;
