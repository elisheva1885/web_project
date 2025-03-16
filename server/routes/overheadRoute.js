const express = require("express")
const router = express.Router()
const overheadController = require("../controllers/overheadController")
const adminVerify = require("../middleware/adminVerify")
const officialVerify = require("../middleware/officialVerify")
const veriftyJWT = require("../middleware/verifyJWT")
router.post("/",overheadController.createOverhead)
router.get("/",veriftyJWT,overheadController.readOverhead)
router.get("/overhead/:_id", overheadController.readOverheadById)
router.get("/:title", overheadController.readOverheadByTitle)

router.put("/", overheadController.updateOverhead)
router.delete("/",officialVerify, overheadController.deleteOverhead)

module.exports = router