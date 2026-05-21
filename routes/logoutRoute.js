const express = require("express")
const router = express.Router()
const logoutHandler = require("../controllers/logoutHandler")

router.get("/", logoutHandler)

module.exports = router;