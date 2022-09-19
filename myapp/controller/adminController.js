//admin controller
const { sequelize } = require("../models");
const db = require("../models");
const { options } = require("../routes/bookRoutes");
const Book = db.books;
const User = db.users;
const Purchase = db.purchase;
const Op = db.Sequelize.Op;

//create and save a new book
exports.create = (req, res) => {
      //restricting access
      /*
      if (req.query.role !== 'admin') {
        res.status(403).send({message : 'You do not have permission to perform this action'})
    } */
    // Validate request
    if (!req.body.title) {
      res.status(400).send({
        message: "Content can not be empty!"
      });
      return;
    }
    // Create a book
    const book = {
      title: req.body.title,
      author: req.body.author,
      price: req.body.price,
      quantity : req.body.quantity
    };
    // Save Book in the database
    Book.create(book)
      .then(data => {
        res.send({
          message : 'success',
          data});
      })
      .catch(err => {
        res.status(500).send({
          message:
            err.message || "Some error occurred while creating the book."
        });
      });
  };

//update a book 
exports.update = (req, res) => {
    //Check if user is admin
    const id = req.params.id;
    Book.update(req.body,{
        where: { bookId: id },
        logging:true,
        benchmark:true
      })
      .then(num => {
        if (num == 1) {
          res.send({
            message: "Book was updated successfully."
        });
        } else {
          res.status(404).send({
            message:`Book with id:${id} not found.`
          });
        }
      })
      .catch(err => {
        res.status(500).send({
          message: "Error updating book with id=" + id
        });
      });
  };

//delete a book
//soft deletion
exports.delete = async(req, res) => {
    //Check if user is admin
    const id = req.params.id;
    await Book.destroy({
        where: { bookId: id }
        })
    .then(num => {
      if (num == 1) {
        res.send({
          message: "Book was soft deleted successfully!"
        });
      } else {
        res.status(404).send({
          message:`Book with id:${id} not found.`
        });
      }
    })
    .catch(err => {
      res.status(500).send({
        message: "Could not delete book with id=" + id
      });
    });
};

//hard deletion
//soft deletion
exports.hdelete = (req, res) => {
    //Check if user is admin
    const id = req.params.id;
    Book.destroy({
        where: { bookId: id },
        force:true
    })
    .then(num => {
      if (num == 1) {
        res.send({
          message: "Book was soft deleted successfully!"
        });
      } else {
        res.status(404).send({
          message:`Book with id:${id} not found.`
        });
      }
    })
    .catch(err => {
      res.status(500).send({
        message: "Could not delete book with id=" + id
      });
    });
};

//get purchase details
const Pagination = (page, size) => {
  const limit = size ? +size : 3;
  const offset = page ? page * limit : 0;
  return { limit, offset};
};
const getPagingData = (data, page, limit) => {
  const { count: totalItems, rows: purchase} = data;
  const currentPage = page ? +page : 0;
  const totalPages = Math.ceil(totalItems / limit);
  return { totalItems, purchase, totalPages, currentPage };
};
exports.purchaseDetails = (req, res) => {
  const { page, size, title } = req.query;
  var condition = title ? { title: { [Op.like]: `%${title}%` } } : null;
  const { limit, offset } = Pagination(page, size);
  Purchase.findAndCountAll({ 
    attributes:['id','quantity','userId','bookId','totalprice'],
    where: condition, 
    limit, 
    offset, 
    include :[{model:Book,attributes:['title','author','price']},{model:User,attributes:['username','role']}]
  })
    .then(data => {
      const response = getPagingData(data, page, limit);
      res.send(response);
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred."
      });
    });
};
