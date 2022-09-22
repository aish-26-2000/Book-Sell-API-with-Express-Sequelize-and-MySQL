//require models
const { response } = require("express");
const db = require("../models");
const Purchase = db.purchase;
const Book = db.books;
const User = db.users;

//queries
//get book details
exports.fetchBookDetails = async(_id) => {
    return Book.findByPk(_id);    
};

//create purchase item
exports.createItem = async(item) => { 
    return Purchase.create(item)
}

//update quantity
exports.update = async(_id,by) => {
    await Book.findOne({
        where : {
            bookId : _id
        }
    }).then(book => {
        book.decrement('quantity',{by:by});
        book.reload();
    })
}

