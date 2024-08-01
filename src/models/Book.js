const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Books = sequelize.define(
  "Books",
  {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    tableName: "books",
    timestamps: false,
  }
);

module.exports = Books;
