const express = require("express")
const router = express.Router()
const deliveryController = require("../controllers/deliveryController")
const adminVerify = require("../middleware/adminVerify")
const officialVerify = require("../middleware/officialVerify")
const veriftyJWT = require("../middleware/verifyJWT")

router.post("/",veriftyJWT, deliveryController.createDelivery)
router.get("/",officialVerify, deliveryController.readDeliveries)
router.get("/:id",veriftyJWT, deliveryController.readDeliveriesByUserId)
router.put("/",officialVerify, deliveryController.updateDelivery)

module.exports = router