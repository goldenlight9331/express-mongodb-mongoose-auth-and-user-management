import { mongoose, bcrypt, jwt, createError } from "#packages/index.js";

import env from "#env/index.js";

const { JWT_SECRET, JWT_EXPIRY, JWT_ALGORITHM } = env;
const { Schema, model } = mongoose;

const UserSchema = new Schema(
  {
    firstName: {
      type: String,
      required: [true, "First name is required"],
      trim: true,
      minlength: [2, "First name must be at least 2 characters long"],
    },

    lastName: {
      type: String,
      required: [true, "Last name is required"],
      trim: true,
      minlength: [2, "Last name must be at least 2 characters long"],
    },

    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, "Please provide a valid email address"],
    },

    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [6, "Password must be at least 6 characters long"],
    },

    role: {
      type: String,
      enum: {
        values: ["admin", "user"],
        message: "Role must be either admin or user",
      },
      default: "user",
      required: true,
    },

    profilePicture: {
      type: String,
      default: null,
    },
    
    isEmailVerified: {
      type: Boolean,
      default: false,
    },

    isApproved: {
      type: Boolean,
      default: false,
    },

    isRemembered: {
      type: Boolean,
      default: false,
    }
  },
  {
    timestamps: true, // Adds createdAt and updatedAt timestamps to the document
    toJSON: {
      transform: (doc, ret) => {
        delete ret.password; // Removes the password field from the JSON representation
        return ret; // Returns the modified object
      },
    },
  },
);

UserSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
  }
  next();
});

UserSchema.methods.generateAuthToken = function () {
  const token = jwt.sign(
    {
      role: this.role,
    },
    JWT_SECRET,
    {
      expiresIn: JWT_EXPIRY,
      algorithm: JWT_ALGORITHM,
    },
  );
  return token;
};

UserSchema.methods.comparePassword = async function (password) {
  if (!password || !this.password) {
    throw createError(400, "Password is required");
  }

  try {
    const isMatch = await bcrypt.compare(password, this.password);

    if (!isMatch) {
      throw createError(401, "Invalid credentials");
    }

    return isMatch;
  } catch (error) {
    throw createError(500, error.message);
  }
};

export const User = model("User", UserSchema);
