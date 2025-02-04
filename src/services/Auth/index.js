import env from "#env/index.js";
import utilities from "#utilities/index.js";
import { dataAccess } from "#dataAccess/index.js";
import { createError } from "#packages/index.js";
import { sendVerificationEmail } from "./helpers.js";

const {
  transporter,
  generateAuthToken,
  generateVerificationToken,
  checkEmailVerification,
  decodeToken,
} = utilities;
const { USER_EMAIL } = env;
const { save, fetch } = dataAccess;

export const AuthService = {
  signUp: async ({ firstName, lastName, email, password, role }) => {
    const existingUser = await fetch.userByEmail(email);
    if (existingUser) {
      throw createError(400, "A user with this email already exists.");
    }

    const newUser = await save.user(firstName, lastName, email, password, role);
    if (!newUser) {
      throw createError(500, "Failed to create a new user.");
    }

    const verificationToken = generateVerificationToken(newUser.email);
    if (!verificationToken) {
      throw createError(500, "An error occurred while generating the token.");
    }

    const isEmailSent = await sendVerificationEmail(email, verificationToken);
    if (!isEmailSent) {
      throw createError(500, "Failed to send the welcome email.");
    }

    return "User registered successfully";
  },

  signIn: async ({ email, password }) => {
    const existingUser = await fetch.userByEmail(email);
    if (!existingUser) {
      throw createError(401, "Invalid email or password.");
    }

    const isEmailVerified = await checkEmailVerification(email);
    if (!isEmailVerified) {
      throw createError(401, "Please verify your email before signing in.");
    }

    const isApproved = existingUser.isApproved;
    if (!isApproved) {
      throw createError(401, "User is not approved");
    }

    const isValid = await existingUser.comparePassword(password);
    if (!isValid) {
      throw createError(401, "Invalid email or password.");
    }

    const token = generateAuthToken(existingUser.role, existingUser.email);
    if (!token) {
      throw createError(500, "Token generation failed");
    }

    const result = {
      userId: existingUser._id,
      token,
    };

    return result;
  },

  signOut: async (token) => {
    const decoded = await decodeToken(token);
    if (!decoded) {
      throw createError(401, "The provided token is invalid or expired.");
    }

    const userId = decoded.userId;
    const expiresAt = new Date(Date.now() + 60 * 60 * 1000); // 1-hour expiration
    const blacklistedToken = await save.blacklistedToken(
      token,
      expiresAt,
      userId,
    );

    if (!blacklistedToken) {
      throw createError(500, "An error occurred while blacklisting the token.");
    }

    return "Sign-out successful. The token has been invalidated.";
  },

  forgotPassword: async (email, password) => {
    const existingUser = await fetch.userByEmail(email);
    if (!existingUser) {
      throw createError(400, "A user with this email does not exist.");
    }

    const verificationToken = generateVerificationToken(existingUser.email);
    if (!verificationToken) {
      throw createError(500, "An error occurred while generating the token.");
    }

    const isEmailSent = await sendVerificationEmail(email, verificationToken);
    if (!isEmailSent) {
      throw createError(500, "Failed to send the welcome email.");
    }

    const updatedUser = await update.forgottenPassword(email, hashedPassword);
    if (!updatedUser) {
      throw createError(404, "User not found or update failed");
    }

    const hashedPassword = await hashPassword(password);
    if (!hashedPassword) {
      throw createError(500, "An error occurred while hashing the password.");
    }

    return "Password updated successfully";
  },
};
