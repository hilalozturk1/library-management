const validateUser = require('./userValidator');
const validateBook = require('./bookValidator');
const validateBorrow = require('./borrowValidator');
const validateReturnBook = require('./returnBookValidator');

module.exports = { validateUser, validateBook, validateBorrow, validateReturnBook };
