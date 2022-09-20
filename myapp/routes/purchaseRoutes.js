//loading modules
const express = require('express');
const controller = require("../controller/purchaseController"); 
const authcontroller = require("../controller/authController"); 

//creating router
const router = express.Router();

//get a book
router.get('/:id',controller.checkAvailability,authcontroller.protect);

//purchase a book
router.post('/:id',controller.purchasebook,authcontroller.protect);



//export
module.exports = router;
