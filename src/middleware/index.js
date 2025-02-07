import {
  createError,
  multer,
  path,
  morgan,
  cors,
  express,
} from "#packages/index.js";

import utilities from "#utilities/index.js";
import env from "#env/index.js";

const { asyncHandler, decodeToken, logger } = utilities;
const { NODE_ENV } = env; // Ensure NODE_ENV is available

const UPLOAD_DIR = "uploads/";
const ALLOWED_FILE_TYPES = /jpeg|jpg|png/;
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

const corsOptions = {
  origin: true,
  exposedHeaders: ["Authorization"],
};

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, UPLOAD_DIR),
  filename: (req, file, cb) => cb(null, `${Date.now()}-${file.originalname}`),
});

const fileFilter = (req, file, cb) => {
  const mimetypeValid = ALLOWED_FILE_TYPES.test(file.mimetype);
  const extValid = ALLOWED_FILE_TYPES.test(
    path.extname(file.originalname).toLowerCase(),
  );
  return mimetypeValid && extValid
    ? cb(null, true)
    : cb(new Error("Only .png, .jpg and .jpeg format allowed!"));
};

const upload = multer({
  storage,
  limits: { fileSize: MAX_FILE_SIZE },
  fileFilter,
});

const middleware = {
  applyGlobalMiddleware: (app) => {
    app.use(morgan("dev"));
    app.use(cors(corsOptions));
    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));
  },

  errorHandler: (err, req, res, _) => {
    const status = err.statusCode || 500;
    const message = err.message || "Something went wrong";
    logger.error(
      JSON.stringify(
        {
          success: false,
          status,
          message,
          stack: NODE_ENV === "development" ? err.stack : {},
        },
        null,
        2,
      ),
    );
    res.status(status).json({
      error: {
        success: false,
        status,
        message,
        stack: NODE_ENV === "development" ? err.stack : {},
      },
    });
  },

  invalidRouteHandler: (_, res) =>
    res.status(404).json({ message: "Endpoint not found" }),

  validateDto: (schema) =>
    asyncHandler(async (req, res, next) => {
      const { value, error } = schema.validate(req.body, { abortEarly: false });
      if (error) {
        const errorMessages = error.details.map(({ message }) => message);
        throw createError(
          400,
          `Validation failed: ${errorMessages.join(", ")}`,
        );
      }
      req.body = value;
      next();
    }),

  verifyAuthToken: asyncHandler(async (req, res, next) => {
    const authHeader = req.headers["authorization"];
    if (!authHeader) {
      throw createError(403, "Authorization header is missing.");
    }
    const token = authHeader.split(" ")[1];
    if (!token) {
      throw createError(403, "Token is missing in the authorization header.");
    }
    const decoded = await decodeToken(token);
    if (!decoded) {
      throw createError(401, "Invalid or expired token.");
    }
    req.user = decoded;
    next();
  }),

  verifyAuthRole: (authorizedRole) =>
    asyncHandler(async (req, res, next) => {
      if (!req.user) {
        throw createError(401, "Authentication required.");
      }
      if (req.user.role !== authorizedRole) {
        throw createError(
          403,
          `Access denied: ${authorizedRole} role required.`,
        );
      }
      next();
    }),

  uploadFiles: upload.fields([
    { name: "profilePicture", maxCount: 1 },
    { name: "coverPhoto", maxCount: 1 },
  ]),
};

export default middleware;
