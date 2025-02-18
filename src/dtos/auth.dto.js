import Joi from "joi";

const firstNameValidation = Joi.string().trim().min(2).required().messages({
  "string.base": "First name should be a type of text.",
  "string.empty": "First name should not be empty.",
  "string.min": "First name must be at least 2 characters long.",
  "any.required": "First name is required.",
});

const lastValidation = Joi.string().trim().min(2).required().messages({
  "string.base": "Last name should be a type of text.",
  "string.empty": "Last name should not be empty.",
  "string.min": "Last name must be at least 2 characters long.",
  "any.required": "Last name is required.",
});

const usernameValidation = Joi.string().trim().lowercase().required().messages({
  "string.base": "Username should be a type of text.",
  "string.empty": "Username should not be empty.",
  "any.required": "Username is required.",
});

const emailValidation = Joi.string()
  .email()
  .trim()
  .lowercase()
  .required()
  .messages({
    "string.base": "Email should be a type of text.",
    "string.email": "Please provide a valid email address.",
    "string.empty": "Email should not be empty.",
    "any.required": "Email is required.",
  });

const passwordValidation = Joi.string().trim().min(6).required().messages({
  "string.base": "Password should be a type of text.",
  "string.empty": "Password should not be empty.",
  "string.min": "Password must be at least 6 characters long.",
  "any.required": "Password is required.",
});

const roleValidation = Joi.string().required().valid("admin", "user").messages({
  "string.base": "Role should be a type of text.",
  "any.only": "Role must be either admin or user.",
  "any.required": "Role is required.",
});

const isRememberedValidation = Joi.boolean().required().messages({
  "boolean.base": "Is remembered should be a type of boolean.",
  "any.required": "A boolean value of isRemembered field is required.",
});

const signUpDto = Joi.object({
  firstName: firstNameValidation,
  lastName: lastValidation,
  username: usernameValidation,
  email: emailValidation,
  password: passwordValidation,
  role: roleValidation,
});

const signInDto = Joi.object({
  email: emailValidation,
  password: passwordValidation,
  isRemembered: isRememberedValidation,
});

const forgotPasswordDto = Joi.object({
  email: emailValidation,
});

export { signUpDto, signInDto, forgotPasswordDto };
