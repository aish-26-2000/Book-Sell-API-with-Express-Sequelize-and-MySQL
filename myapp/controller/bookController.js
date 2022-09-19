//create the controller
//CRUD functions

const { sequelize } = require("../models");
const db = require("../models");
const { options } = require("../routes/bookRoutes");
const Book = db.books;
const Op = db.Sequelize.Op;

//get all books
const Pagination = (page, size) => {
  const limit = size ? +size : 3;
  const offset = page ? page * limit : 0;
  return { limit, offset};
};
const getPagingData = (data, page, limit) => {
  const { count: totalItems, rows: books } = data;
  const currentPage = page ? +page : 0;
  const totalPages = Math.ceil(totalItems / limit);
  return { totalItems, books, totalPages, currentPage};
};
exports.findAll = (req, res) => {
  const { page, size, title } = req.query;
  var condition = title ? { title: { [Op.like]: `%${title}%` } } : null;
  const { limit, offset } = Pagination(page, size);
  Book.findAndCountAll({ 
    where: condition, 
    limit, 
    offset
  })
    .then(data => {
      const response = getPagingData(data, page, limit);
      res.send(response);
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving books."
      });
    });
};

//get one book
exports.findOne = (req, res) => {
  Book.findByPk(req.params.id)
  .then(data => {
    if (!data) {
      res.status(404).json({
        status :'fail',
        message : 'Book not found'
      });
    } else {
      res.send({
        message : 'success',
        data});
    }
  })
  .catch(err => {
    res.status(500).send({
      message: "Error retrieving Book with id=" + id
    });
  });
};

