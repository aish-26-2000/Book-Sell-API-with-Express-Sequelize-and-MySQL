//Defining the sequelize model
//Purchase table in MySQL dB
module.exports = (sequelize, Sequelize) => {
    const Purchase = sequelize.define('purchase', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      quantity : {
        type: Sequelize.INTEGER
      
      },
      totalprice : {
        type: Sequelize.INTEGER
      
      }
    },{
      paranoid:true,
      tableName : 'purchase'
    });
  
    return Purchase;
  };