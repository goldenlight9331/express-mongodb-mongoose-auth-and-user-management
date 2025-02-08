import {
  jwt,
  winston,
  nodemailer,
  fs,
  path,
  fileURLToPath,
  dirname,
} from "#packages/index.js";

import env from "#env/index.js";

const {
  NODE_ENV,
  EMAIL_HOST,
  EMAIL_PORT,
  USER_EMAIL,
  USER_PASSWORD,
  EMAIL_SERVICE,
  JWT_SECRET_KEY,
  JWT_SHORT_EXPIRY,
  JWT_LONG_EXPIRY,
  JWT_VERIFICATION_LINK_EXPIRY,
} = env;

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

  generateVerificationToken: (id) => {
    return jwt.sign({ id }, JWT_SECRET_KEY, {
      expiresIn: JWT_VERIFICATION_LINK_EXPIRY,
    });
  },

  generateAuthToken: (role, id, isRemembered) => {
    const expiry = isRemembered ? JWT_LONG_EXPIRY : JWT_SHORT_EXPIRY;
    return jwt.sign({ role, id }, JWT_SECRET_KEY, {
      expiresIn: expiry,
    });
  },

  decodeToken: async (token) => {
    return jwt.verify(token, JWT_SECRET_KEY);
  },

  sendVerificationEmail: async (toEmail, verificationToken) => {
    let verificationEmailHtml = fs.readFileSync(
      path.join(__dirname, "../views/VerificationEmail", "index.html"),
      "utf-8",
    );

    verificationEmailHtml = verificationEmailHtml.replace(
      "${backendUrl}",
      `${NODE_ENV === "production" ? "https://api.studenttutorhub.org" : "http://localhost:5000"}`,
    );

    verificationEmailHtml = verificationEmailHtml.replace(
      "${verificationToken}",
      verificationToken,
    );

    const mailOptions = {
      from: USER_EMAIL,
      to: toEmail,
      subject: "Welcome to Student Tutor Hub 🙌",
      html: verificationEmailHtml,
    };

    const info = await transporter.sendMail(mailOptions);
    logger.info(`Email sent: ${info.response}`);
    return true;
  },

  sendVerificationNotification: () => {
    let confirmationEmailHtml = fs.readFileSync(
      path.join(__dirname, "../views/VerificationNotification", "index.html"),
      "utf-8",
    );

    confirmationEmailHtml = confirmationEmailHtml.replace(
      "${frontendUrl}",
      `${NODE_ENV === "production" ? "https://studenttutorhub.org" : "http://localhost:5173"}/login`,
    );

    return confirmationEmailHtml;
  },

  deleteFile: (filePath) => {
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
  },

  transporter,
  logger,
};
