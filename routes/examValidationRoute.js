const router = require("express").Router()
const examValidationHandler = require("../controllers/examValidHandler")

router.post("/:id", examValidationHandler)

module.exports = router;