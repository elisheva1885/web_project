const express = require("express")
const router = express.Router()
const branchController = require("../controllers/branchController")
const officialVerify = require("../middleware/officialVerify")

router.post("/",officialVerify ,branchController.createBranch)
router.get("/",branchController.readBranch)
router.get("/:city",branchController.readBranchByCity)
router.put("/",officialVerify ,branchController.updateBranch)
router.delete("/",  officialVerify,branchController.deleteBranch)

module.exports = router