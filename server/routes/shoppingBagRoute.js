const express = require("express")
const router = express.Router()
const shoppingBagController = require("../controllers/shoppingBagController")
const adminVerify = require("../middleware/adminVerify")
const officialVerify = require("../middleware/officialVerify")
const veriftyJWT = require("../middleware/verifyJWT")

router.post("/",veriftyJWT, shoppingBagController.createShoppingBag)
router.get("/", veriftyJWT ,shoppingBagController.readShoppingBagByUserId)
router.put("/",veriftyJWT ,shoppingBagController.updateShoppingBagAmount)
router.delete("/", veriftyJWT,  shoppingBagController.deleteShoppingBag)

module.exports = router