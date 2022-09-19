//authorization controller
const db = require("../models");
const config = require("../config/auth.config");
const User = db.users;
const Op = db.Sequelize.Op;
const {promisify} = require('util');
const bcrypt = require("bcrypt");
const jwt = require('jsonwebtoken');


//generate token
const signToken = id => {
  return jwt.sign({id},config.secret,{
      expiresIn : 60
  });
}

//send token
const createSendToken = (User,statusCode,res) => {
const token = signToken(User.userId);
//cookie
const cookieOptions = {
  expires: new Date(
    Date.now() + 60 * 24 * 60 * 60 * 1000
  ),
  //httpOnly: true
};
res.cookie('jwt', token, cookieOptions);

// Remove password from output
User.password = undefined;
//response
res.status(statusCode).json({
    status:'success',
    token,
    data : {
        User 
    }
});
};

//protect route
exports.protect = async (req, res, next) => {
  //Getting token and check of it's there
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return next(
      res.status(401).send({
        message : 'User need to SignIn.'})
    );
  }

  //Verification token
  console.log(token);
  const decoded = await promisify(jwt.verify)(token, config.secret);
  console.log(decoded);
  //Check if user still exists
  const currentUser = await User.findByPk(decoded.id);
  if (!currentUser) {
    return next(
      res.status(401).send({
        message : 'The user belonging to this token does no longer exist.'})
    );
  }

  //Grant access to protected route
  req.user = currentUser;
  next();
};


//create new user
exports.createUser = async(req,res) => {
    // Validate request
    if (!req.body.username || !req.body.password) {
     res.status(400).send({
       message: "Enter all details!"
     });
     return;
   }
    // Create a user
    const user = {
     username: req.body.username,
     role:req.body.role,
     email: req.body.email,
     password: await bcrypt.hashSync(req.body.password,8)
   };
   // Save user in the database
   User.create(user)
     .then(data => {
       res.send({
         message : 'success',
         data});
        createSendToken(user, 200, res);   
     })
     .catch(err => {
       res.status(500).send({
         message:
           err.message || "Some error occurred while creating the book."
       });
     });
 }
 
 //user login
 exports.login = async(req,res,next) => {
   const user = User.findOne({
    where : {username:req.body.username}
   })
    .then(user => {
        if(!user) {
            return res.status(404).send({
                status: "fail",
                message:"User not found"
            });
        }
        else {
          createSendToken(user, 200, res); 
        }       
   })
    .catch(err => {
        res.status(500).send({ message: err.message });
    });
 };

//verify user
exports.verifyUser = () => {
  return (req,res,next) => {
    const username = req.body.username;
    const password = req.body.password;

    //check for username and password
    if (!user || !password) {
      res.status(400).send({ error: 'You need a username and password' });
      return;
    }

    //check if user exits in DB
    User.findAll({
      where : {
        username,
      },
    })
      .then((user) => {
        console.log('Finding user',user);
        if (!user[0]) {
          res.status(401).send({ error: 'No user with the given credentials' });
        } else {
          // checking the passwords
          if (!bcrypt.compareSync(password, user[0].password)) {
            res.status(401).send({ error: 'Incorrect password' });
          } else {
            // if everything is good,
            // then attach to req.user
            // and call next so the controller
            req.user = user[0];
            next();
          }
        }
      })
      .catch((err) => {
        next(err);
      });
  };
};