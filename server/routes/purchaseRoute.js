const express = require("express")
const router = express.Router()
const purchaseController = require("../controllers/purchaseController")
const adminVerify = require("../middleware/adminVerify")
const officialVerify = require("../middleware/officialVerify")
const veriftyJWT = require("../middleware/verifyJWT")

router.post("/",veriftyJWT, purchaseController.createPurchase)
router.get("/",veriftyJWT, purchaseController.readPurchases)
router.get("/:id",veriftyJWT, purchaseController.readPurchasesByUserId)
router.put("/",veriftyJWT, purchaseController.updatePurchase)
router.delete("/",veriftyJWT, purchaseController.deletePurchase)

module.exports = router