import utility from "#utility/index.js";
import { dataAccess } from "#dataAccess/index.js";
import { createError } from "#packages/index.js";

const {
  generateToken,
  verifyToken,
  // transporter,
} = utility;
const { save, fetch } = dataAccess;

// const sendWelcomeEmail = async (toEmail) => {
//   try {
//     const mailOptions = {
//       from: "ruhekat@outlook.com",
//       to: toEmail,
//       subject: "Welcome to Our Platform",
//       text: `Hi,\n\nWelcome to our platform! We're excited to have you on board.\n\nBest Regards,\nYour Company`,
//       html: `<p>Hi,</p><p>Welcome to our platform! We're excited to have you on board.</p><p>Best Regards,</p><p>Your Company</p>`,
//     };

//     const info = await transporter.sendMail(mailOptions);
//     console.log(`Email sent: ${info.response}`);
//   } catch (error) {
//     console.error(`Error sending email: ${error.message}`);
//     throw error;
//   }
// };

export const AuthService = {
  signUp: async ({ name, email, password }) => {
      const existingUser = await fetch.userByEmail(email);
      if (existingUser) {
        throw createError(400, "A user with this email already exists.");
      }

      const newUser = await save.user(name, email, password);
      if (!newUser) {
        throw createError(500, "Failed to create a new user.");
      }

      // await sendWelcomeEmail(email);

      return "User created successfully";
  },
  signIn: async ({ email, password, isRemembered }) => {
      const existingUser = await fetch.userByEmail(email);
      if (!existingUser) {
        throw createError(401, "Invalid email or password.");
      }

      const isValid = await user.comparePassword(password);
      if (!isValid) {
        throw createError(401, "Invalid email or password.");
      }
  
      const token = generateToken(
        isRemembered,
        existingUser.role,
        existingUser.id,
      );
      if (!token) {
        throw createError(500, "An error occurred while generating the token.");
      }
  
      return {
        message: "Sign-in successful",
        user: {
          name: existingUser.name,
        },
        token,
      };
  },
  signOut: async (token) => {
    const decoded = await verifyToken(token);
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
};
