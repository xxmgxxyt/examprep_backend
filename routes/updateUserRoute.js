const router = require("express").Router();
const { updateUserHandler } = require("../controllers/updateUserHandler");

router.put("/", updateUserHandler)

module.exports = router;