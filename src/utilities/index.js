import env from "#env/index.js";
import {
  jwt,
  createError,
  winston,
  bcrypt,
  nodemailer,
  fs,
  path,
  fileURLToPath,
  dirname,
} from "#packages/index.js";
import { dataAccess } from "#dataAccess/index.js";

const {
  NODE_ENV,
  EMAIL_HOST,
  EMAIL_PORT,
  USER_EMAIL,
  USER_PASSWORD,
  EMAIL_SERVICE,
  JWT_SECRET_KEY,
  JWT_EXPIRY,
  JWT_VERIFICATION_LINK_EXPIRATION_TIME,
} = env;
const { fetch } = dataAccess;

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

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
    service: EMAIL_SERVICE, // You can also use 'smtp' and provide the custom SMTP server if needed
    host: EMAIL_HOST, // Replace with the correct SMTP server provided by Hostinger
    port: EMAIL_PORT, // Usually 587 for TLS or 465 for SSL
    secure: false, // Set to true if you're using SSL (465)
    auth: {
      user: USER_EMAIL,
      pass: USER_PASSWORD,
    },
    connectionTimeout: 60000, // 1 minute timeout for establishing the connection
    greetingTimeout: 30000, // Timeout for receiving the greeting
    sendTimeout: 30000, // Timeout for sending the message
  });

  transporter.verify((error) => {
    if (error) {
      logger.error(`Error connecting to email server: ${error.message}`);
    } else {
      logger.info("Email server is ready to send messages".white.bold);
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

  generateVerificationToken: (userId) => {
    return jwt.sign({ userId }, JWT_SECRET_KEY, {
      expiresIn: JWT_VERIFICATION_LINK_EXPIRATION_TIME,
    });
  },

  generateAuthToken: (role, userId) => {
    return jwt.sign({ role, userId }, JWT_SECRET_KEY, {
      expiresIn: JWT_EXPIRY,
    });
  },

  decodeToken: async (token) => {
    const decoded = jwt.verify(token, JWT_SECRET_KEY);
    return decoded;
  },

  checkEmailVerification: async (email) => {
    const user = await fetch.userByEmail(email);
    if (!user) {
      throw createError(404, "User not found");
    }

    if (!user.isEmailVerified) {
      throw createError(401, "Please verify your email before signing in");
    }

    return true;
  },

  verificationNotification: () => {
    let confirmationEmailHtml = fs.readFileSync(
      path.join(__dirname, "../public/VerificationNotification", "index.html"),
      "utf-8",
    );

    confirmationEmailHtml = confirmationEmailHtml.replace(
      "${forntendUrl}",
      `${
        NODE_ENV === "production"
          ? "https://domainName.org"
          : "http://localhost:5173"
      }/login`,
    );

    return confirmationEmailHtml;
  },

  deleteFile: (filePath) => {
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
      console.log(`Deleted file: ${filePath}`);
    } else {
      console.log(`File not found: ${filePath}`);
    }
  },

  transporter,
  logger,
};
