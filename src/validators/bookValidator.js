const Joi = require("joi");

const bookSchema = Joi.object({
  name: Joi.string().min(3).max(255).required(),
});

// Function to validate book data
const validateBook = (book) => {
  return bookSchema.validate(book);
};

module.exports = validateBook;
