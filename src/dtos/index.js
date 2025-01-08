import { Joi } from "#packages/index.js";

const dtos = {
  signUp: Joi.object({
    name: Joi.string().min(2).required().messages({
      "string.base": "Name should be a type of text",
      "string.empty": "Name should not be empty",
      "string.min": "Name must be at least 2 characters long",
      "any.required": "Name is required",
    }),
    email: Joi.string().email().required().messages({
      "string.base": "Email should be a type of text",
      "string.email": "Please provide a valid email address",
      "string.empty": "Email should not be empty",
      "any.required": "Email is required",
    }),
    password: Joi.string().min(6).required().messages({
      "string.base": "Password should be a type of text",
      "string.empty": "Password should not be empty",
      "string.min": "Password must be at least 6 characters long",
      "any.required": "Password is required",
    }),
    role: Joi.string().valid("admin", "teacher", "viewer").messages({
      "string.base": "Role should be a type of text",
      "any.only": "Role must be either admin, teacher or viewer",
    }),
  }),
  signIn: Joi.object({
    email: Joi.string().email().required().messages({
      "string.base": "Email should be a type of text",
      "string.email": "Please provide a valid email address",
      "string.empty": "Email should not be empty",
      "any.required": "Email is required",
    }),
    password: Joi.string().min(6).required().messages({
      "string.base": "Password should be a type of text",
      "string.empty": "Password should not be empty",
      "string.min": "Password must be at least 6 characters long",
      "any.required": "Password is required",
    }),
  }),
};

export default dtos;
