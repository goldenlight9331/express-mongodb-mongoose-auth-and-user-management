import { Joi } from "#packages/index.js";

const nameValidation = Joi.string().trim().min(2).required().messages({
  "string.base": "Name should be a type of text",
  "string.empty": "Name should not be empty",
  "string.min": "Name must be at least 2 characters long",
  "any.required": "Name is required",
});

const emailValidation = Joi.string()
  .email()
  .trim()
  .lowercase()
  .required()
  .messages({
    "string.base": "Email should be a type of text",
    "string.email": "Please provide a valid email address",
    "string.empty": "Email should not be empty",
    "any.required": "Email is required",
  });

const passwordValidation = Joi.string().trim().min(6).required().messages({
  "string.base": "Password should be a type of text",
  "string.empty": "Password should not be empty",
  "string.min": "Password must be at least 6 characters long",
  "any.required": "Password is required",
});

const roleValidation = Joi.string().valid("admin", "user").messages({
  "string.base": "Role should be a type of text",
  "any.only": "Role must be either admin or user",
});

const isRememberedValidation = Joi.boolean()
  .truthy("yes", "true", 1)
  .falsy("no", "false", 0)
  .optional()
  .messages({
    "boolean.base": "isRemembered should be a boolean value",
  });

// DTOs
const dtos = {
  signUp: Joi.object({
    name: nameValidation,
    email: emailValidation,
    password: passwordValidation,
    role: roleValidation,
  }),
  signIn: Joi.object({
    email: emailValidation,
    password: passwordValidation,
    isRemembered: isRememberedValidation,
  }),
  forgotPassword: Joi.object({
    email: emailValidation,
    password: passwordValidation,
  }),
};

export default dtos;
