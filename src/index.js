require("dotenv").config();

const express = require("express");
const port = process.env.PORT || 3000;
const app = express();
const sequelize = require("./config/database");

const { User, Book, SingleBook, Borrow } = require("./models");
const { validateUser, validateBook, validateBorrow, validateReturnBook } = require("./validators");

const updateAverageScore = require("./services/updateBookScores");

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
  // Get Users
  app.get("/users", async (req, res) => {
    try {
      const users = await User.findAll();

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

  // Create a new user
  app.post("/users", async (req, res) => {
    try {
      const { error } = validateUser(req.body);
      if (error) {
        return res.status(400).json({ message: error.details[0].message });
      }

      const user = await User.create({ name: req.body.name });
      res.status(201).json(user);
    } catch (err) {
      res.status(500).json({ message: "Error creating user" });
    }
  });

  //get single book
  app.get("/books/:id", async (req, res) => {
    try {
      const bookId = req.params.id;

      // Find book
      const book = await SingleBook.findByPk(bookId);

      if (!book) {
        return res.status(404).json({ message: "Book not found" });
      }

      const response = {
        id: book.id,
        name: book.name,
        score: book.averageScore !== null ? book.averageScore.toFixed(2) : -1,
      };

      res.status(200).json(response);
    } catch (err) {
      res.status(500).json({ message: "Error fetching book information" });
    }
  });

  //create a new book
  app.post("/books", async (req, res) => {
    try {
      const { error } = validateBook(req.body);
      if (error) {
        return res.status(400).json({ message: error.details[0].message });
      }

      const { name } = req.body;

      const newBook = await Book.create({ name });

      res.status(201).json(newBook);
    } catch (err) {
      res.status(500).json({ message: "Error creating book", error: err.message });
    }
  });

  // Endpoint to borrow a book
  app.post("/users/:userId/borrow/:bookId", (req, res) => {
    const { userId, bookId } = req.params;
    const { error } = validateBorrow({ userId, bookId });

    // If validation fails, return a 400 Bad Request response
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }

    User.findByPk(userId)
      .then((user) => {
        if (!user) {
          return res.status(404).json({ message: "User not found" });
        }

        return Book.findByPk(bookId).then((book) => {
          if (!book) {
            return res.status(404).json({ message: "Book not found" });
          }

          // Check if the user has any unreturned books
          return Borrow.findOne({
            where: {
              userId,
              returnDate: null, // This means the book has not been returned yet
            },
          }).then((unreturnedBorrow) => {
            // If the user has an unreturned book, return an error
            if (unreturnedBorrow) {
              return res
                .status(400)
                .json({ message: "The user has not returned a previous book yet" });
            }

            // Create a new borrow record
            return Borrow.create({
              userId,
              bookId,
              returnDate: null, // Null means the book has not been returned yet
              userScore: null, // Null until the user rates the book
            }).then((newBorrow) => {
              res.status(201).json(newBorrow);
            });
          });
        });
      })
      .catch((err) => {
        res.status(500).json({ message: "Error borrowing book", error: err.message });
      });
  });

  // Endpoint to return a book and give a rating
  app.post("/users/:userId/return/:bookId", (req, res) => {
    const { userId, bookId } = req.params;
    const { score } = req.body;

    // Validate input
    const { error } = validateReturnBook({
      userId: parseInt(userId),
      bookId: parseInt(bookId),
      score,
    });

    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }

    User.findByPk(userId)
      .then((user) => {
        if (!user) {
          return res.status(404).json({ message: "User not found" });
        }
        return Book.findByPk(bookId);
      })
      .then((book) => {
        if (!book) {
          return res.status(404).json({ message: "Book not found" });
        }
        return Borrow.findOne({
          where: {
            userId,
            bookId,
            returnDate: null,
          },
        });
      })
      .then((borrowRecord) => {
        if (!borrowRecord) {
          return res
            .status(404)
            .json({ message: "Borrow record not found or the book has already been returned" });
        }

        // Update the borrow record with the return date and score
        borrowRecord.returnDate = new Date(); // Set current date
        borrowRecord.userScore = score;

        return borrowRecord.save();
      })
      .then(() => updateAverageScore(bookId))
      .then(() => {
        res.status(200).json({ message: "Book returned successfully" });
      })
      .catch((err) => {
        console.error("Error:", err);
        res
          .status(500)
          .json({ message: "Error returning book and giving a rating", error: err.message });
      });
  });

  app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
  });
});
