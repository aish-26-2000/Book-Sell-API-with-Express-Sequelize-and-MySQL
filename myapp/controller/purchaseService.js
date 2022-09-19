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

/*
//purchase book
exports.purchasebook = async(req,res) => {
    const t = await sequelize.transaction();
    try {
      Book.findByPk(req.params.id)
        .then(data => {
          if(!data) {
              res.send({message:'Check the id again'
          })
          } else {
              const purchaseItem = {
                  userId : req.body.userId,
                  bookId : req.body.bookId,
                  quantity : req.body.quantity
  
              }
              Purchase.create(purchaseItem)            
              .then(item => {
                  res.send({
                    message : 'success',
                    details : {
                      purchaseId : item.id,
                      userId: item.userId,
                      bookId: item.bookId,
                      quantity : item.quantity,
                      totalPrice : data.price * item.quantity
                    }
                    })
                    
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
//update quantity
exports.updateQuantity = async(req,res) => {
  const t = await sequelize.transaction();
  try{
    const book = Book.findByPk(req.params.id)
      .then(data => {
        const qty1 = data.quantity;
        console.log(qty1);
        Purchase.findOne({where : {bookId :book }})
        .then(item => {
          const qty = item.quantity;
          console.log(qty);

          Book.update({
            quantity : qty1 - qty},
            {where : {bookId : req.params.id}
          },{transcation : t});
        })
      })
    await t.commit();
  } catch(error) {
    await t.rollback();
  }
    
}
*/

//purchase a book
exports.purchasebook = async(req,res) => {
  const t = await sequelize.transaction();
  try {
    Book.findByPk(req.params.id)
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
            //const price = data.price;
            const qty1 = data.quantity;
            //create purchase
            Purchase.create(purchaseItem)            
            .then(item => {
                const qty = item.quantity;
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
                  //update book quantity
                  Book.update({
                    quantity : qty1 - qty},
                    {where : {bookId : req.params.id}
                  },{transcation : t});
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




