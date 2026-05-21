const router = require("express").Router()
const { instructorDashBoard } = require("../controllers/dashBoardHandler")

router.post("/", instructorDashBoard)

module.exports = router;