const express = require("express")
const router = express.Router()
const multiIndoorUnitController = require("../controllers/multiIndoorUnitController")
const adminVerify = require("../middleware/adminVerify")
const officialVerify = require("../middleware/officialVerify")
const verifyJWT = require("../middleware/verifyJWT")
const upload = require("../middleware/multer")

router.post("/",upload.single('imagepath'),multiIndoorUnitController.createMultiIndoorUnit)
router.get("/",multiIndoorUnitController.readMultiIndoorUnits)
router.get("/miniCenteral/:_id",multiIndoorUnitController.readMultiIndoorUnitById)
router.get("/:title",multiIndoorUnitController.readMultiIndoorUnitsByTitle)
router.put("/",officialVerify, multiIndoorUnitController.updateMultiIndoorUnit)
router.put("/stock",officialVerify, multiIndoorUnitController.updatMultiIndoorUnitStock)
router.put("/price",officialVerify, multiIndoorUnitController.updatMultiIndoorUnitPrice)
router.delete("/", multiIndoorUnitController.deleteMultiIndoorUnit)

module.exports = router