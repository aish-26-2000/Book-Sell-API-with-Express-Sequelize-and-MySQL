//Defining the sequelize model
//Books table in MySQL dB
module.exports = (sequelize, Sequelize) => {
    const Book =  sequelize.define("book", {
      bookId: {
        type: Sequelize.INTEGER,
        primaryKey : true,
        autoIncrement: true
      },
      title: {
        type: Sequelize.STRING
      },
      author: {
        type: Sequelize.STRING
      },
      price: {
        type: Sequelize.INTEGER,
        allowNull : false
      },
      quantity: {
        type: Sequelize.BIGINT,
        notNull : true
      }
    }/*,{
      classMethods: {
        associate(models) {
          Book.hasMany(models.purchaseItem);
    }
    }
    }*/,{
      paranoid:true,
      tableName : 'book'
    });
    return Book;
  };




