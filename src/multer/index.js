import { multer, path } from "#packages/index.js";

const UPLOAD_DIR = "uploads/";
const ALLOWED_FILE_TYPES = /jpeg|jpg|png/;
const MAX_FILE_SIZE = 1024 * 1024 * 5; // 5MB

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, UPLOAD_DIR);
  },
  filename: function (req, file, cb) {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const fileFilter = (req, file, cb) => {
  const filetypes = ALLOWED_FILE_TYPES;
  const mimetype = filetypes.test(file.mimetype);
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());

  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb(new Error("Only .png, .jpg and .jpeg format allowed!"));
  }
};

const upload = multer({
  storage: storage,
  limits: { fileSize: MAX_FILE_SIZE }, // 5MB limit
  fileFilter: fileFilter,
});

export const uploadFiles = upload.fields([
  { name: "profilePicture", maxCount: 1 }, // For profile picture
  { name: "coverPhoto", maxCount: 1 }, // For cover photo
  { name: "qualificationCertificates", maxCount: 5 }, // For qualification certificates (up to 5 files)
  { name: "identityCardPictures", maxCount: 2 }, // For identity card pictures (up to 2 files)
]);
