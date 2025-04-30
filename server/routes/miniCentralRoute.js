const express = require("express")

const path = require('path');
const multer = require('multer');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        // Save files to the 'public/uploads' directory in the project
        cb(null, './public/uploads');
    },
    filename: function (req, file, cb) {
        // Generate a unique filename for each uploaded file
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + '-' + file.originalname);
    }
});


const upload = multer({ storage: storage });

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