const Joi = require('@hapi/joi')

// const authSchema = Joi.object({
//   email: Joi.string().email().lowercase().required(),
//   password: Joi.string().min(2).required(),
// })

const authSchema = Joi.object({
  firstname: Joi.string().required(),
  lastname: Joi.string().required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
});

const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
});


module.exports = {
  authSchema,
  loginSchema
}
