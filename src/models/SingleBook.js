const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Book = sequelize.define(
  "Book",
  {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    averageScore: {
      type: DataTypes.FLOAT,
      allowNull: true,
    },
  },
  {
    tableName: "books",
    timestamps: false,
  }
);

module.exports = Book;
