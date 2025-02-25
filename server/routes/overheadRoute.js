const express = require("express")
const router = express.Router()
const overheadController = require("../controllers/overheadController")

router.post("/", overheadController.createOverhead)
router.get("/", overheadController.readOverhead)
router.get("/overhead/:_id", overheadController.readOverheadById)
router.get("/:title", overheadController.readOverheadByTitle)

router.put("/", overheadController.updateOverhead)
router.delete("/", overheadController.deleteOverhead)

module.exports = router