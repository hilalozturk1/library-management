// models/Borrow.js
const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");
const User = require("./User");
const Book = require("./Book");

const Borrow = sequelize.define(
  "Borrow",
  {
    userId: {
      type: DataTypes.INTEGER,
      references: {
        model: User,
        key: "id",
      },
    },
    bookId: {
      type: DataTypes.INTEGER,
      references: {
        model: Book,
        key: "id",
      },
    },
    returnDate: {
      type: DataTypes.DATE,
      allowNull: true, // Null means the book is currently borrowed
    },
    userScore: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
  },
  {
    tableName: "borrows",
    timestamps: false,
  }
);

User.hasMany(Borrow, { foreignKey: "userId" });
Borrow.belongsTo(User, { foreignKey: "userId" });

Book.hasMany(Borrow, { foreignKey: "bookId" });
Borrow.belongsTo(Book, { foreignKey: "bookId" });

module.exports = Borrow;
