const express = require("express")
const router = express.Router()
const overheadController = require("../controllers/overheadController")
const adminVerify = require("../middleware/adminVerify")
const officialVerify = require("../middleware/officialVerify")
const veriftyJWT = require("../middleware/verifyJWT")
const verifyJWT = require("../middleware/verifyJWT")
const upload = require("../middleware/multer")
router.post("/",upload.single('imagepath'),overheadController.createOverhead)
router.get("/",overheadController.readOverheads)
router.get("/overhead/:_id", overheadController.readOverheadById)
router.get("/:title", overheadController.readOverheadByTitle)
router.put("/", officialVerify, overheadController.updateOverhead)
router.put("/price",officialVerify, overheadController.updatOverheadPrice)
router.put("/stock", overheadController.updateOverheadStock)

router.delete("/", overheadController.deleteOverhead)

module.exports = router