import Joi from "joi";

const loginSchema = Joi.object({
  email: Joi.string().required().email({ tlds: { allow: false } }),
  password: Joi.string().required()
});

 const signUpSchema = Joi.object({
  name: Joi.string().required(),
  email: Joi.string().email({ tlds: { allow: false } }).required(),
  password: Joi.string().required(),
  confirmPassword: Joi.any().valid(Joi.ref('password')).required()
});

const transactionSchema = Joi.object({
  value: Joi.number().min(0).required(),
  description: Joi.string().required(),
  operation: Joi.valid('credit', 'debit').required()
});

export {loginSchema, signUpSchema, transactionSchema};