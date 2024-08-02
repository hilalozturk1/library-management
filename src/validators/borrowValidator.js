const Joi = require('joi');

const borrowSchema = Joi.object({
  userId: Joi.number()
    .integer()
    .positive()
    .required(),
  bookId: Joi.number()
    .integer()
    .positive()
    .required()
});

const validateBorrow = (borrowData) => {
  return borrowSchema.validate(borrowData);
};

module.exports = validateBorrow;
