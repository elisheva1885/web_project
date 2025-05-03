const express = require("express")
const router = express.Router()
const companyController = require("../controllers/companyController")
// const officalVerify = require("../middleware/officalVerify")
const upload = require("../middleware/multer")

router.post("/",upload.single('imagepath') ,companyController.createCompany)
router.get("/", companyController.readCompany)
router.get("/:name", companyController.readCompanyByName)
router.delete("/", companyController.deleteCompany)

module.exports = router