import env from "#env/index.js";
import { blacklistedToken } from "#models/index.js";
import {
  jwt,
  createError,
  winston,
  bcrypt,
  nodemailer,
} from "#packages/index.js";

const {
  NODE_ENV,
  JWT_SECRET_KEY,
  JWT_SHORT_EXPIRATION_TIME,
  JWT_LONG_EXPIRATION_TIME,
  EMAIL_USER,
  EMAIL_PASSWORD,
} = env;

const createLogger = () => {
  const logConfig = {
    levels: { error: 0, warn: 1, info: 2, debug: 3 },
    colors: { error: "red", warn: "yellow", info: "green", debug: "blue" },
  };

  winston.addColors(logConfig.colors);

  const consoleFormat = winston.format.combine(
    winston.format.colorize(),
    winston.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
    winston.format.printf(({ level, message, timestamp }) => {
      return `${timestamp} [${level}]: ${message}`;
    }),
  );

  return winston.createLogger({
    levels: logConfig.levels,
    transports: [
      new winston.transports.Console({
        format: consoleFormat,
        level: NODE_ENV === "production" ? "warn" : "debug",
        handleExceptions: true,
      }),
    ],
    exitOnError: false,
  });
};

const logger = createLogger();

const createTransporter = () => {
  const transporter = nodemailer.createTransport({
    service: "outlook",
    auth: { user: EMAIL_USER, pass: EMAIL_PASSWORD },
  });

  transporter.verify((error) => {
    if (error) {
      logger.error(`Error connecting to email server: ${error.message}`);
    } else {
      logger.info("Email server is ready to send messages");
    }
  });

  return transporter;
};

const transporter = createTransporter();

export default {
  asyncHandler: (fn) => async (req, res, next) => {
    try {
      await fn(req, res, next);
    } catch (error) {
      next(error);
    }
  },
  generateToken: (isRemembered, role, userId) => {
    return jwt.sign({ role, userId }, JWT_SECRET_KEY, {
      expiresIn: isRemembered
        ? JWT_LONG_EXPIRATION_TIME
        : JWT_SHORT_EXPIRATION_TIME,
    });
  },

  verifyToken: async (token) => {
    const expiredToken = await blacklistedToken.findUnique({
      where: { token },
    });
    if (expiredToken) {
      throw createError(401, "Token has been invalidated");
    }
    return jwt.verify(token, JWT_SECRET_KEY);
  },

  transporter,
  logger,
};
