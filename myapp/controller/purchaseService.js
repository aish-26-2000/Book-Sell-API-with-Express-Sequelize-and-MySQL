//require models
const db = require("../models");
const Purchase = db.purchase;
const Book = db.books;
const User = db.users;

//queries
//update quantity
exports.decrementVal = (model,val) => {
    model.decrement('quantity',{by:val})
    model.reload();
};

