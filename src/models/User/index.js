import { mongoose, bcrypt, jwt } from "#packages/index.js";
import env from "#env/index.js";

const { JWT_SECRET, JWT_EXPIRY, JWT_ALGORITHM } = env;
const { Schema, model } = mongoose;

const UserSchema = new Schema({
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
    required: true,
  },
  isEmailVerified: {
    type: Boolean,
    default: false,
  },
  isApproved: {
    type: Boolean,
    default: false,
  },
  profilePicture: {
    type: String,
    default: null,
  },
});

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
  try {
    const isMatch = await bcrypt.compare(password, this.password);

    if (!isMatch) {
      throw createError(401, "Invalid credentials");
    }

    return isMatch;
  } catch (error) {
    throw "";
  }
};

export const User = model("User", UserSchema);
