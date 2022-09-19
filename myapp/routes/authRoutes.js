//authentication routes
const controller = require("../controller/authController");
const express = require('express');

//creating router
const router = express.Router();

router.post("/signup",controller.createUser);
router.post("/signin", controller.login);

//export
module.exports = router;
