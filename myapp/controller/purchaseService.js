//require models
const { sequelize, books } = require("../models");
const db = require("../models");
const Purchase = db.purchase;
const Book = db.books;
const User = db.users;
const transaction = require('../models/transactionExecuter');

//purchase queries
exports.checkAvailability = (req,res) => {
    Book.findByPk(req.params.id)
    .then(data => {
      if (!data) {
        res.status(404).json({
          status :'fail',
          message : 'Book not found'
        });
      } else {
          if(data.quantity === 0){
              res.status(404).send({message:'Book is out of stock'})
      } else {res.send({
                  message : 'Book is available. Please proceed to Purchase',
                  details : {
                      bookId : data.bookId, 
                      title : data.title, 
                      quantity : data.quantity, 
                      price : data.price
                  }
              });}
      }
    })
    .catch(err => {
      res.status(500).send({
        message: "Error retrieving Book with id=" + id
      });
    });
}

//update quantity
const updateQty = async(req,res) => {

  Book.findOne({
    where : {
      bookId : req.params.id
    }
  }).then(book => {
    return book.decrement('quantity',);
  }).then(book => {
    book.reload();
  })
}


//purchase a book
exports.purchasebook = async(req,res) => {
  const t = await sequelize.transaction();
  try {
    const book = Book.findByPk(req.params.id)
      .then(data => {
        if(!data) {
            res.send({message:'Check the id again'
        })
        } else {
            const purchaseItem = {
                userId : req.body.userId,
                bookId : req.body.bookId,
                quantity : req.body.quantity,
                totalprice : req.body.quantity * data.price

            }
            const qty1 = data.quantity;
            //create purchase
            Purchase.create(purchaseItem)            
            .then(item => {
                const qty = item.quantity;
                //check if quantity is valid
                if((qty1- qty) < 0 ) {
                  res.status(404).send({status:'fail',message : 'Required number of books unavailable'})
                } else {
                res.send({
                  message : 'success',
                  details : {
                    purchaseId : item.id,
                    userId: item.userId,
                    bookId: item.bookId,
                    quantity : item.quantity,
                    totalPrice : item.totalprice
                  }
                  })
                  //update quantity
                  Book.findOne({
                    where : {
                      bookId : req.params.id
                    }
                  }).then(book => {
                    return book.decrement('quantity',{by:item.quantity});
                  }).then(book => {
                    book.reload();
                  })
                }
              },{transaction :  t})
            .catch(err => {
                res.status(500).send({
                  message:
                    err.message || "Some error occurred."
                });
              })
        }
      });  
      await t.commit();
} catch (error) {
  await t.rollback();
}
}






