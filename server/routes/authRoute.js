const express = require("express")
const router = express.Router()
const authController = require("../controllers/authController")
const adminVerify = require("../middleware/adminVerify")
router.post("/register", authController.register)
router.post("/login", authController.login)
router.post("/admin/register", adminVerify ,authController.registerAdmin)

module.exports = router