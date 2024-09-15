const express = require("express");
const { ExecutiveSummaryController } = require("../controllers/executiveSummary.controllers");
const router = express.Router();

//get requests
router.get("/", ExecutiveSummaryController.getAll)
router.get("/metric", ExecutiveSummaryController.getMetricData)
router.get("/years", ExecutiveSummaryController.getAllYears)

//post requests
router.post("/item", ExecutiveSummaryController.getItem)
router.post("/create", ExecutiveSummaryController.create)
router.post("/figures", ExecutiveSummaryController.getFigures)

//put requests

//patch requests

//delete requests

//customScripts

module.exports.ExecutiveSummaryRouter = router;
