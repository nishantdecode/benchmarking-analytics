const express = require("express");
const { BulkControllers } = require("../controllers/bulk.controllers");
const { IndividualBankController } = require("../controllers/individualBank.controllers");
const { singleFileUploadMiddleware } = require("../middlewares/file-upload.middlewares");
const router = express.Router();

//get requests
router.get("/export",BulkControllers.exportData);

//post requests
router.post("/create",IndividualBankController.create)
router.post("/tables",IndividualBankController.getTablesData)
router.post("/competition",IndividualBankController.getCompetitionData)
router.post("/trend",IndividualBankController.getTrendTable)
router.post("/bank",IndividualBankController.getBankData)
router.post("/import",singleFileUploadMiddleware("file"),BulkControllers.importData);

module.exports.IndividualBankRouter = router;
