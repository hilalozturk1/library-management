require("dotenv").config();

const express = require("express");
const port = process.env.PORT || 3000;
const app = express();
const sequelize = require("./config/database");

const User = require("./models/User");
const Book = require("./models/Book");
const Borrow = require("./models/Borrow");

app.use(express.json());

const connection = async () => {
  try {
    await sequelize.authenticate();

    console.log("Connection has been established successfully.");

    // test query
    const [results, metadata] = await sequelize.query("SHOW TABLES");
    console.log("Tables:", results);
  } catch (error) {
    console.error("Unable to connect to the database:", error);
    process.exit(1); // close it when connection faild
  }
};

connection().then(() => {
  const validateUser = require("./validators/userValidator");

  // Get Users
  app.get("/users", async (req, res) => {
    try {
      const users = await User.findAll();
      console.log(users);
      res.status(200).json(users);
    } catch (err) {
      res.status(500).json({ message: "Error fetching users" });
    }
  });

  // Get Books
  app.get("/books", async (req, res) => {
    try {
      const books = await Book.findAll();
      res.status(200).json(books);
    } catch (err) {
      res.status(500).json({ message: "Error fetching users" });
    }
  });

  app.get("/users/:id", async (req, res) => {
    try {
      const userId = req.params.id;
      const user = await User.findByPk(userId, {
        include: {
          model: Borrow,
          include: Book,
        },
      });

      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      const pastBooks = [];
      const presentBooks = [];

      user.Borrows.forEach((borrow) => {
        if (borrow.returnDate) {
          pastBooks.push({
            name: borrow.Book.name,
            userScore: borrow.userScore,
          });
        } else {
          presentBooks.push({
            name: borrow.Book.name,
          });
        }
      });

      const result = {
        id: user.id,
        name: user.name,
        books: {
          past: pastBooks,
          present: presentBooks,
        },
      };

      res.status(200).json(result);
    } catch (err) {
      res.status(500).json({ message: "Error fetching user information" });
    }
  });

  app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
  });
});