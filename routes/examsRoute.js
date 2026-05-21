const express = require("express")
const router = express.Router()
const { getExamHandler } = require("../controllers/createExamHandler")

router.get("/", getExamHandler)

module.exports = router;