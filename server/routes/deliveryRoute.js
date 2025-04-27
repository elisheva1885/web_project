const express = require("express")
const router = express.Router()
const deliveryController = require("../controllers/deliveryController")
const adminVerify = require("../middleware/adminVerify")
const officialVerify = require("../middleware/officialVerify")
const veriftyJWT = require("../middleware/verifyJWT")

router.post("/",veriftyJWT, deliveryController.createDelivery)
router.get("/",veriftyJWT, deliveryController.readDeliveries)
router.get("/:username",veriftyJWT, deliveryController.readDeliveriesByUserName)
router.put("/",veriftyJWT, deliveryController.updateDelivery)
router.delete("/",veriftyJWT, deliveryController.deleteDelivery)

module.exports = router