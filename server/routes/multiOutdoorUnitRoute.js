const express = require("express")
const router = express.Router()
const multiOutdoorUnitController = require("../controllers/multiOutdoorUnitController")
const adminVerify = require("../middleware/adminVerify")
const officialVerify = require("../middleware/officialVerify")
const verifyJWT = require("../middleware/verifyJWT")
const upload = require("../middleware/multer")

router.post("/",upload.single('imagepath'),multiOutdoorUnitController.createMultiOutdoorUnit)
router.get("/",multiOutdoorUnitController.readMultiOutdoorUnits)
router.get("/multiOutdoorUnit/:_id",multiOutdoorUnitController.readMultiOutdoorUnitById)
router.get("/:title",multiOutdoorUnitController.readMultiOutdoorUnitsByTitle)
router.put("/",officialVerify, multiOutdoorUnitController.updateMultiOutdoorUnit)
router.put("/stock",officialVerify, multiOutdoorUnitController.updatMultiOutdoorUnitStock)
router.put("/price",officialVerify, multiOutdoorUnitController.updatMultiOutdoorUnitPrice)
router.delete("/", multiOutdoorUnitController.deleteMultiOutdoorUnit)

module.exports = router