const express = require("express")
const router = express.Router()
const companyController = require("../controllers/companyController")
const officalVerify = require("../middleware/officialVerify")
const upload = require("../middleware/multer")

router.post("/",upload.single('imagepath') ,officalVerify,companyController.createCompany)
router.get("/", companyController.readCompany)
router.get("/:name", companyController.readCompanyByName)
router.delete("/", officalVerify,companyController.deleteCompany)

module.exports = router