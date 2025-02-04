const express = require("express")
const router = express.Router()
const branchController = require("../controllers/branchController")

router.post("/", branchController.createBranch)
router.get("/", branchController.readBranch)
router.get("/:city", branchController.readBranchByCity)
router.put("/", branchController.updateBranch)
router.delete("/", branchController.deleteBranch)

module.exports = router