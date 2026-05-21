const express = require("express")
const router = express.Router()
const { createExamHandler, getExamHandler, deleteExamHandler } = require("../controllers/createExamHandler")

router.post("/", createExamHandler)
    .get("/", getExamHandler)
    .delete("/:id", deleteExamHandler)

module.exports = router;