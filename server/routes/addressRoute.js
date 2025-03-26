const express = require("express")
const router = express.Router()
const addressController = require("../controllers/addressController")
const adminVerify = require("../middleware/adminVerify")
const officialVerify = require("../middleware/officialVerify")
const veriftyJWT = require("../middleware/verifyJWT")

router.post("/",veriftyJWT, addressController.createAddress)
router.get("/",veriftyJWT, addressController.readAddresses)
router.get("/:id",veriftyJWT, addressController.readAddressesByUserId)
router.put("/",veriftyJWT, addressController.updateAddress)
router.delete("/",veriftyJWT, addressController.deleteAddress)

module.exports = router