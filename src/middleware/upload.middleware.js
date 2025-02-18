import createError from "http-errors";
import multer from "multer";
import fs from "fs";
import path from "path";

import { uploadDirectory } from "#constants/index.js";

// Ensure the upload directory exists
if (!fs.existsSync(uploadDirectory)) {
  fs.mkdirSync(uploadDirectory, { recursive: true });
}

const ALLOWED_FILE_TYPES = /jpeg|jpg|png/;
const MAX_FILE_SIZE = 5 * 1024 * 1024;
const ALLOWED_FILE_TYPES_MESSAGE =
  "Only .png, .jpg, and .jpeg formats are allowed!";

// Multer configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDirectory),
  filename: (req, file, cb) => cb(null, `${Date.now()}-${file.originalname}`),
});

const fileFilter = (req, file, cb) => {
  const isValid =
    ALLOWED_FILE_TYPES.test(file.mimetype) &&
    ALLOWED_FILE_TYPES.test(path.extname(file.originalname).toLowerCase());
  if (isValid) {
    return cb(null, true);
  }
  return cb(createError(400, ALLOWED_FILE_TYPES_MESSAGE));
};

const upload = multer({
  storage,
  limits: { fileSize: MAX_FILE_SIZE },
  fileFilter,
});

const uploadFiles = upload.fields([{ name: "profilePicture", maxCount: 1 }]);

export { uploadFiles };
