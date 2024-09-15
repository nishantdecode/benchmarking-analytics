const express = require("express");
const { KeyRatioController } = require("../controllers/keyRatio.controllers");
const router = express.Router();

//get requests
router.get("/",KeyRatioController.getAll)
router.get("/years",KeyRatioController.getAllYears)

//post requests
router.post("/ratio",KeyRatioController.getRatio)
router.post("/create",KeyRatioController.create)
router.post("/figures",KeyRatioController.getFigures)
router.post("/ratioBank",KeyRatioController.getRatioBank)
router.post("/figuresCategory",KeyRatioController.getFiguresByCategory)

//put requests

//patch requests

//delete requests

//customScripts

module.exports.KeyRatioRouter = router;
