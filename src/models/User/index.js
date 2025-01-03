import { mongoose, bcrypt, jwt, createError } from '#packages/index.js';
import { handleError, dotEnv } from '#utils/index.js';

const { JWT_SECRET } = dotEnv;

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Full name is required'],
    trim: true,
    minlength: [2, 'First name must be at least 2 characters long'],
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email address'],
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [6, 'Password must be at least 6 characters long'],
  },
  role: {
    type: String,
    required: [true, 'Role is required'],
    enum: {
      values: ['admin', 'user'],
      message: 'Role must be either admin, or user',
    },
    default: 'user',
  },
});

UserSchema.pre('save', async function (next) {
  if (this.isModified('password')) {
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
      expiresIn: '1h',
      algorithm: 'HS256',
    },
  );
  return token;
};

UserSchema.methods.comparePassword = async function (password) {
  try {
    const isMatch = await bcrypt.compare(password, this.password);

    if (!isMatch) {
      throw createError(401, 'Invalid credentials');
    }

    return isMatch;
  } catch (error) {
    throw handleError(error, 'Failed to compare passwords');
  }
};

export const User = mongoose.model('users', UserSchema);
