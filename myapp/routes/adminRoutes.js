//loading modules
const express = require('express');
const adminController = require("../controller/adminController"); 
const controller = require("../controller/authController");


//creating router
const router = express.Router();

//create new book
router.post("/",adminController.create,controller.protect);

//update a book
router.patch("/:id",adminController.update,controller.protect);

//delete a book
//soft delete
router.delete("/:id",adminController.delete);
//hard delete
router.delete("/hdelete/:id",adminController.hdelete);

//purchase details
router.get("/purchases",adminController.purchaseDetails);


//export
module.exports = router;
