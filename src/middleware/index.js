import {
  cookieParser,
  createError,
  multer,
  morgan,
  cors,
  express,
  path,
  fileURLToPath,
  dirname,
} from "#packages/index.js";

import { asyncHandler, decodeToken } from "#utils/index.js";
import { logger, env } from "#config/index.js";

const { NODE_ENV, COOKIE_NAME } = env;

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const UPLOAD_DIR = path.join(__dirname, "../../public/uploads");
const ALLOWED_FILE_TYPES = /jpeg|jpg|png/;
const MAX_FILE_SIZE = 5 * 1024 * 1024;

const corsOptions = {
  origin: true,
  credentials: true,
};

// Helper to validate file type based on mimetype and file extension
const isAllowedFileType = (file) =>
  ALLOWED_FILE_TYPES.test(file.mimetype) &&
  ALLOWED_FILE_TYPES.test(path.extname(file.originalname).toLowerCase());

// Configure multer storage without file-type check (validation is done in fileFilter)
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, UPLOAD_DIR),
  filename: (req, file, cb) => cb(null, `${Date.now()}-${file.originalname}`),
});

// Validate file type in the file filter
const fileFilter = (req, file, cb) => {
  if (isAllowedFileType(file)) {
    return cb(null, true);
  }
  return cb(new Error("Only .png, .jpg, and .jpeg formats are allowed!"));
};

const upload = multer({
  storage,
  limits: { fileSize: MAX_FILE_SIZE },
  fileFilter,
});

const applyGlobalMiddleware = (app) => {
  app.use(morgan("dev"));
  app.use(cors(corsOptions));
  app.use(cookieParser());
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
};

// eslint-disable-next-line no-unused-vars
const errorHandler = (err, req, res, next) => {
  const status = err.statusCode || 500;
  const message = err.message || "Something went wrong";
  const errorResponse = {
    success: false,
    status,
    message,
    stack: NODE_ENV === "development" ? err.stack : {},
  };

  logger.error(JSON.stringify(errorResponse, null, 2));
  res.status(status).json(errorResponse);
};

const invalidRouteHandler = (req, res) =>
  res.status(404).json({ message: "Endpoint not found" });

const validateDto = (schema) =>
  asyncHandler(async (req, res, next) => {
    const { value, error } = schema.validate(req.body, { abortEarly: false });
    if (error) {
      const errorMessages = error.details.map(({ message }) => message);
      throw createError(400, `Validation failed: ${errorMessages.join(", ")}`);
    }
    req.body = value;
    next();
  });

const verifyAuthToken = asyncHandler(async (req, res, next) => {
  const token = req.cookies[COOKIE_NAME];
  if (!token) {
    throw createError(403, "Token is missing.");
  }
  const decoded = await decodeToken(token);
  if (!decoded) {
    throw createError(401, "Invalid or expired token.");
  }
  req.user = decoded;
  next();
});

const verifyAuthRole = (authorizedRole) =>
  asyncHandler(async (req, res, next) => {
    if (!req.user) {
      throw createError(401, "Authentication required.");
    }
    if (req.user.role !== authorizedRole) {
      throw createError(403, `Access denied: ${authorizedRole} role required.`);
    }
    next();
  });

const uploadFiles = upload.fields([
  { name: "profilePicture", maxCount: 1 },
  { name: "coverPhoto", maxCount: 1 },
]);

export {
  applyGlobalMiddleware,
  errorHandler,
  invalidRouteHandler,
  validateDto,
  verifyAuthToken,
  verifyAuthRole,
  uploadFiles,
};
