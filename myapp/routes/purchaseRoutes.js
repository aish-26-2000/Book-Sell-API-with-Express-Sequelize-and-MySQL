//loading modules
const express = require('express');
const controller = require("../controller/purchaseController"); 
const authcontroller = require("../controller/authController"); 
const service = require("../controller/purchaseService");

//creating router
const router = express.Router();

//get a book
router.get('/:id',controller.getBook,authcontroller.protect);

//purchase a book
router.post('/:id',controller.purchaseBook,authcontroller.protect);



//export
module.exports = router;
