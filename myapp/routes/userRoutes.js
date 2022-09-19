//loading modules
const express = require('express');
const userController = require("../controller/userController");
const authcontroller = require("../controller/authController");

//creating router
const router = express.Router();

//users
//get all users
router.get("/",userController.findAll,authcontroller.protect);

//get one user
router.get("/:id",userController.findbyId,authcontroller.protect);

//delete a user
router.delete("/:id",userController.delete,authcontroller.protect);


//export
module.exports = router;
