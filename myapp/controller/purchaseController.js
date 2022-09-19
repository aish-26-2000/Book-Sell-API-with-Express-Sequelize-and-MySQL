//require models
const purchaseService = require("../controller/purchaseService");

//const sequelize = require('../models/sequelize');

//check bookavailability
exports.getBook = purchaseService.checkAvailability;


//purchase a book
exports.purchaseBook = purchaseService.purchasebook;
    

