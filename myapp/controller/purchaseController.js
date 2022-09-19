//require models
const { sequelize } = require("../models");
const db = require("../models");
const Purchase = db.purchase;
const Book = db.books;
const User = db.users;
const transaction = require('../models/transactionExecuter');
const purchaseService = require("../controller/purchaseService");

//const sequelize = require('../models/sequelize');

//check bookavailability
exports.getBook = purchaseService.checkAvailability;


//purchase a book
exports.purchaseBook = purchaseService.purchasebook;
    

