const Joi = require('joi');

const userSchema = Joi.object({
  name: Joi.string().min(3).required()
});

const validateUser = (user) => {
  return userSchema.validate(user);
};

module.exports = validateUser;
