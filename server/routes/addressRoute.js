const express = require("express")
const router = express.Router()
const addressController = require("../controllers/addressController")
const veriftyJWT = require("../middleware/verifyJWT")

router.post("/",veriftyJWT, addressController.createAddress)
router.get("/existAddress",veriftyJWT, addressController.readAddressesByUserId)
router.put("/",veriftyJWT, addressController.updateAddress)
router.delete("/",veriftyJWT, addressController.deleteAddress)

module.exports = router

