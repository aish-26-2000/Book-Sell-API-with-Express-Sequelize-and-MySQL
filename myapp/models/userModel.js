//Defining the sequelize model
//Users table in MySQL dB
module.exports = (sequelize, Sequelize) => {
  const User = sequelize.define("user", {
    userId: {
      type: Sequelize.INTEGER,
      primaryKey : true,
      autoIncrement: true
    },
    username: {
      type: Sequelize.STRING,
      required : true
    },
    role: {
      type: Sequelize.STRING,
      default: 'user'
    },
    password : {
      type:Sequelize.STRING
    }
  }/*,{
    classMethods: {
      associate(models) {
        User.hasMany(models.purchaseItem);
  }
  }
  }*/,{
    paranoid:true,
    tableName : 'user'
  });
  return User;
};