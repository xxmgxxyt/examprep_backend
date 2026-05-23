const router = require("express").Router();
const { updateUserHandler, deleteUserHandler } = require("../controllers/usersHandler");

router.put("/", updateUserHandler)
    .delete("/", deleteUserHandler)

module.exports = router;