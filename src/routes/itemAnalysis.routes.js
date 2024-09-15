const express = require("express");
const { ItemAnalysisController } = require("../controllers/itemAnalysis.controllers");
const router = express.Router();

//get requests
router.get("/",ItemAnalysisController.getAll)
router.get("/rank",ItemAnalysisController.addRankingInExistingData)

//post requests
router.post("/create",ItemAnalysisController.create)
router.post("/itemBank",ItemAnalysisController.getItemBank)
router.post("/rank",ItemAnalysisController.getRankByCategory)
router.post("/itemCategory",ItemAnalysisController.getItemByCategory)

//put requests

//patch requests

//delete requests

//customScripts

module.exports.ItemAnalysisRouter = router;
