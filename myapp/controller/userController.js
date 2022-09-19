//create the user controller

const db = require("../models");
const User = db.users;
const Op = db.Sequelize.Op;
const dotenv = require('dotenv');
dotenv.config();

//get all users
const Pagination = (page, size) => {
  const limit = size ? +size : 3;
  const offset = page ? page * limit : 0;
  return { limit, offset};
};
const getPagingData = (data, page, limit) => {
  const { count: totalItems, rows: users } = data;
  const currentPage = page ? +page : 0;
  const totalPages = Math.ceil(totalItems / limit);
  return { totalItems, users, totalPages, currentPage };
};
exports.findAll = (req, res) => {
  const { page, size, title } = req.query;
  var condition = title ? { title: { [Op.like]: `%${title}%` } } : null;
  const { limit, offset } = Pagination(page, size);
  User.findAndCountAll({ where: condition, limit, offset })
    .then(data => {
      const response = getPagingData(data, page, limit);
      res.send(response);
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving users."
      });
    });
};

//get user by id
exports.findbyId = (req,res) => {
  User.findByPk(req.params.id)
  .then(data => {
    if (!data) {
      res.status(404).json({
        status :'fail',
        message : 'User not found'
      });
    } else {
      res.send({
        message : 'success',
        data});
    }
  })
  .catch(err => {
    res.status(500).send({
      message: "Error retrieving User with id=" + id
    });
  });
}

//delete a user
//soft deletion
exports.delete = async(req, res) => {
const id = req.params.userId;
await User.destroy({
    where: { userId: id }
  })
  .then(num => {
    if (num == 1) {
      res.send({
        message: "User was deleted successfully!"
      });
    } else {
      res.status(404).send({
        message:`User with id:${id} not found.`
      });
    }
  })
  .catch(err => {
    res.status(500).send({
      message: "Could not delete user with id=" + id
    });
  });
};

//public access
exports.allAccess = (req, res) => {
  res.status(200).send("Public Content.");
};

//user access
exports.userBoard = (req, res) => {
  res.status(200).send("User Content.");
};

//admin access
exports.adminBoard = (req, res) => {
  res.status(200).send("Admin Content.");
};