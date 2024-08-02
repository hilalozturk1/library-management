const Joi = require("joi");

const returnBookSchema = Joi.object({
  userId: Joi.number().integer().positive().required(),
  bookId: Joi.number().integer().positive().required(),
  score: Joi.number().integer().min(0).max(10).required(), // score is required and should be a number between 0 and 10
});

const validateReturnBook = (data) => {
  return returnBookSchema.validate(data);
};

module.exports = validateReturnBook;
