import createError from "http-errors";
import bcrypt from "bcryptjs";

import { generateToken, decodeToken, sendVerificationEmail, generateUniqueUsername } from "#utils/index.js";
import { dataAccess } from "#dataAccess/index.js";

const { save, read, remove, update } = dataAccess;

const authService = {
  signUp: async ({ firstName, lastName, email, password, role }) => {
    let username;
    let exists = true;
    let attempts = 0;

    while (exists && attempts < 5) {
      username = generateUniqueUsername(firstName, lastName);
      exists = await read.userByUsername(username);
      attempts++;
    }

    if (exists) throw createError(500, "Failed to generate a unique username. Retry...");

    const [existingEmail] = await Promise.all([read.userByEmail(email), read.userByUsername(username)]);
    if (existingEmail) {
      throw createError(400, "A user with this email already exists.");
    }

    const newUser = await save.user(firstName, lastName, username, email, password, role);
    if (!newUser) {
      throw createError(500, "Failed to create a new user.");
    }

    const verificationToken = generateToken(newUser._id);
    if (!verificationToken) {
      await remove.userById(newUser._id);
      throw createError(500, "An error occurred while generating the token.");
    }

    const isEmailSent = await sendVerificationEmail(email, verificationToken);
    if (!isEmailSent) {
      await remove.userById(newUser._id);
      throw createError(500, "Failed to send the welcome email.");
    }

    return "User registered successfully. Please verify your email address.";
  },

  signIn: async ({ email, username, password, isRemembered }) => {
    // Determine login method
    const identifier = email || username;
    if (!identifier || !password) {
      throw createError(400, "Email or username and password are required.");
    }

    // Lookup user by email or username
    const user = email ? await read.userByEmail(email) : await read.userByUsername(username);

    if (!user) {
      throw createError(401, "Invalid email or username.");
    }

    // Validate password
    const isValid = await user.comparePassword(password);
    if (!isValid) {
      throw createError(401, "Invalid password.");
    }

    // Generate auth token
    const token = generateToken(user._id, user.role, isRemembered);
    if (!token) {
      throw createError(500, "Token generation failed.");
    }

    return {
      id: user._id,
      role: user.role,
      name: `${user.firstName} ${user.lastName}`,
      token,
    };
  },

  signOut: async (token) => {
    const decoded = decodeToken(token);
    if (!decoded) {
      throw createError(401, "The provided token is invalid or expired.");
    }

    const id = decoded.id;
    const expiresAt = new Date(Date.now() + 60 * 60 * 1000); // 1-hour expiration
    const blacklistedToken = await save.blacklistedToken(token, expiresAt, id);
    if (!blacklistedToken) {
      throw createError(500, "An error occurred while blacklisting the token.");
    }

    return "Sign-out successful. The token has been invalidated.";
  },

  resetPassword: async ({ email, newPassword }) => {
    const existingUser = await read.userByEmail(email);
    if (!existingUser) {
      throw createError(404, "User not found");
    }

    const salt = await bcrypt.genSalt(10);
    const password = await bcrypt.hash(newPassword, salt);

    const isPasswordUpdated = await update.userById(existingUser._id, {
      password,
    });
    if (!isPasswordUpdated) {
      throw createError(500, "Password update failed");
    }

    return { status: true, message: "Password updated successfully." };
  },
};

export default authService;
