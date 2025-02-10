import { jwt, fs, path, fileURLToPath, dirname } from "#packages/index.js";

import { logger, env, transporter } from "#config/index.js";

const {
  NODE_ENV,
  USER_EMAIL,
  JWT_SECRET_KEY,
  JWT_SHORT_EXPIRY,
  JWT_LONG_EXPIRY,
  JWT_VERIFICATION_LINK_EXPIRY,
} = env;

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

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
    `../../views/${folder}`,
    filename,
  );
  return fs.readFileSync(filePath, "utf-8");
};

const sendVerificationEmail = async (toEmail, verificationToken) => {
  const backendUrl =
    NODE_ENV === "production"
      ? "https://api.studenttutorhub.org"
      : "http://localhost:5000";

  let emailHtml = readEmailTemplate("verification-email", "index.html")
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

  return readEmailTemplate("verification-notification", "index.html").replace(
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
};
