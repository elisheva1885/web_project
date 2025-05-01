const express = require("express")

const path = require('path');
const upload = require("../middleware/multer")

const router = express.Router()
const MiniCenteralController = require("../controllers/MiniCenteralController")
const adminVerify = require("../middleware/adminVerify")
const officialVerify = require("../middleware/officialVerify")
const verifyJWT = require("../middleware/verifyJWT")
router.post("/",upload.single('imagepath'),MiniCenteralController.createMiniCenteral)
router.get("/",MiniCenteralController.readMiniCenterals)
router.get("/miniCenteral/:_id",MiniCenteralController.readMiniCenteralById)
router.get("/:title",MiniCenteralController.readMiniCenteralsByTitle)
router.put("/",officialVerify, MiniCenteralController.updateMiniCenteral)
router.put("/stock",officialVerify, MiniCenteralController.updatMiniCenteralStock)
router.put("/price",officialVerify, MiniCenteralController.updatMiniCenteralPrice)
router.delete("/", MiniCenteralController.deleteMiniCenteral)


module.exports = router