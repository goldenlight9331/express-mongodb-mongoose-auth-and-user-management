import { dotenv } from '#packages/index.js';

dotenv.config();

export const dotEnv = {
  PORT: process.env.PORT || 5000,
  MONGO_URI: process.env.MONGO_URI || 'mongodb://localhost:27017/test',
  JWT_SECRET: process.env.JWT_SECRET || 'jwt_secret',
  JWT_EXPIRY: process.env.JWT_EXPIRY || '7d',
};
