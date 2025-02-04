const express = require("express")
const router = express.Router()
const companyController = require("../controllers/companyController")

router.post("/", companyController.createCompany)
router.get("/", companyController.readCompany)
router.get("/:name", companyController.readCompanyByName)
router.delete("/", companyController.deleteCompany)

module.exports = router