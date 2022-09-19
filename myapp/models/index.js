//initialize sequelize
const dbConfig = require("../config/db.config");
const Sequelize = require("sequelize");

const sequelize = new Sequelize(dbConfig.DB,dbConfig.USER,dbConfig.PASSWORD,{
    host : dbConfig.HOST,
    dialect : dbConfig.dialect,
    logging : false,
    benchmark : true,
    operatorsAliases : false,
    pool : {
        max : dbConfig.pool.max,
        min : dbConfig.pool.min,
        acquire : dbConfig.pool.acquire,
        idle : dbConfig.pool.idle
    }
    });
    
const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.books = require("./bookmodel")(sequelize, Sequelize);
db.users = require("./userModel")(sequelize,Sequelize);
db.purchase = require("./purchaseItem")(sequelize,Sequelize);

db.books.hasMany(db.purchase);
db.users.hasMany(db.purchase);
db.purchase.belongsTo(db.users,{foreignKey : "userId"});
db.purchase.belongsTo(db.books,{foreignKey : "bookId"});



//export
module.exports = db;