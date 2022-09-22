//require models
const { sequelize, books } = require("../models");
const db = require("../models");
const Purchase = db.purchase;
const Book = db.books;
const User = db.users;
const transaction = require('../models/transactionExecuter');
const services = require("../controller/purchaseService");
const { response } = require("express");

//purchase queries
exports.checkAvailability = async(req,res) => {
  const details = await services.fetchBookDetails(+req.params.id)
  if(!details){res.send({status : 'fail',message : 'Book not found'})}
  else {
    if(details.quantity === 0) {
      res.status(404).send({message:'Book is out of stock'})
    }
    else {
      res.send({
        message : 'Book is available. Please proceed to Purchase',
                details : {
                    bookId : details.bookId, 
                    title : details.title, 
                    quantity : details.quantity, 
                    price : details.price
                }
      })
    }
  }
}


//purchase a book
exports.purchasebook = async(req,res) => {
  const t = await sequelize.transaction();
  try {
    const book_details = await services.fetchBookDetails(+req.params.id)
    if(!book_details){res.status(404).send({message:'Check the id again'})}
    else {
      const price = book_details.price;
      const purchaseItem = {
        userId : req.body.userId,
        bookId : req.body.bookId,
        quantity : req.body.quantity,
        totalprice : req.body.quantity * price
      };
      const purchaseDetails = await services.createItem(purchaseItem)
      const bookQty = book_details.quantity;
      const itemQty = purchaseDetails.quantity;
      if(bookQty-itemQty < 0) {
        res.status(404).send({status:'fail',message : 'Required number of books unavailable'})    
      } else {
        await services.update(+req.params.id,itemQty);
        res.send({
          message : 'success',
          details : {
            purchaseId : purchaseDetails.id,
            userId: purchaseDetails.userId,
            bookId: purchaseDetails.bookId,
            quantity : purchaseDetails.quantity,
            totalPrice : purchaseDetails.totalprice
          }
          })
      
      }  
    }
      await t.commit();
  } catch (error) {
    await t.rollback();
  }
  }





