const router = require('express').Router()
const resultsHandler = require("../controllers/resultsHandler")

router.get("/", resultsHandler)

module.exports = router;