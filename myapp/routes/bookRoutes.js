//loading modules
const express = require('express');
const controller = require("../controller/bookController");
const authController = require("../controller/authController"); 


//creating router
const router = express.Router();

//routes
//get all books
router.get("/",controller.findAll);

//get one book
router.get("/:id",controller.findOne);

//export
module.exports = router;

