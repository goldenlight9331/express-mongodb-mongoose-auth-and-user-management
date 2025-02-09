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

/** Logger Configuration */
const createLogger = () => {
  const levels = { error: 0, warn: 1, info: 2, debug: 3 };
  const colors = { error: "red", warn: "yellow", info: "green", debug: "blue" };

  winston.addColors(colors);

  return winston.createLogger({
    levels,
    transports: [
      new winston.transports.Console({
        format: winston.format.combine(
          winston.format.colorize(),
          winston.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
          winston.format.printf(
            ({ level, message, timestamp }) =>
              `${timestamp} [${level}]: ${message}`,
          ),
        ),
        level: NODE_ENV === "production" ? "warn" : "debug",
        handleExceptions: true,
      }),
    ],
    exitOnError: false,
  });
};

const logger = createLogger();

/** Nodemailer Transporter */
const createTransporter = () => {
  const transporter = nodemailer.createTransport({
    service: EMAIL_SERVICE,
    host: EMAIL_HOST,
    port: EMAIL_PORT,
    secure: false, // Set true for SSL (465), false for TLS (587)
    auth: { user: USER_EMAIL, pass: USER_PASSWORD },
    connectionTimeout: 60000,
    greetingTimeout: 30000,
    sendTimeout: 30000,
  });

  transporter.verify((error) => {
    if (error) {
      logger.error(`Email server connection error: ${error.message}`);
    } else {
      logger.info("Email server is ready to send messages.");
    }
  });

  return transporter;
};

const transporter = createTransporter();

/** Utility Functions */
const asyncHandler = (fn) => async (req, res, next) => {
  try {
    await fn(req, res, next);
  } catch (error) {
    next(error);
  }
};

const generateVerificationToken = (id) =>
  jwt.sign({ id }, JWT_SECRET_KEY, { expiresIn: JWT_VERIFICATION_LINK_EXPIRY });

const generateAuthToken = (role, id, isRemembered) => {
  const expiry = isRemembered ? JWT_LONG_EXPIRY : JWT_SHORT_EXPIRY;
  return jwt.sign({ role, id }, JWT_SECRET_KEY, { expiresIn: expiry });
};

const decodeToken = async (token) => jwt.verify(token, JWT_SECRET_KEY);

/** Email Utility */
const readEmailTemplate = (folder, filename) => {
  const filePath = path.join(
    __dirname,
    `../../public/views/${folder}`,
    filename,
  );
  return fs.readFileSync(filePath, "utf-8");
};

const sendVerificationEmail = async (toEmail, verificationToken) => {
  const backendUrl =
    NODE_ENV === "production"
      ? "https://api.studenttutorhub.org"
      : "http://localhost:5000";

  let emailHtml = readEmailTemplate("VerificationEmail", "index.html")
    .replace("${backendUrl}", backendUrl)
    .replace("${verificationToken}", verificationToken);

  const mailOptions = {
    from: USER_EMAIL,
    to: toEmail,
    subject: "Welcome to Student Tutor Hub 🙌",
    html: emailHtml,
  };

  const info = await transporter.sendMail(mailOptions);
  logger.info(`Verification email sent to ${toEmail}: ${info.response}`);
  return true;
};

const sendVerificationNotification = () => {
  const frontendUrl =
    NODE_ENV === "production"
      ? "https://studenttutorhub.org"
      : "http://localhost:5173/login";

  return readEmailTemplate("VerificationNotification", "index.html").replace(
    "${frontendUrl}",
    frontendUrl,
  );
};

/** File Utility */
const deleteFile = (filePath) => {
  if (fs.existsSync(filePath)) {
    fs.unlinkSync(filePath);
    logger.info(`File deleted: ${filePath}`);
  } else {
    logger.warn(`File not found: ${filePath}`);
  }
};

export {
  asyncHandler,
  generateVerificationToken,
  generateAuthToken,
  decodeToken,
  sendVerificationEmail,
  sendVerificationNotification,
  deleteFile,
  transporter,
  logger,
};
