import fs from "fs";
import { logger } from "#config/index.js";

const deleteFile = (filePath) => {
  if (fs.existsSync(filePath)) {
    fs.unlinkSync(filePath);
    logger.info(`File deleted: ${filePath}`);
  } else {
    logger.warn(`File not found: ${filePath}`);
  }
};

export { deleteFile };
