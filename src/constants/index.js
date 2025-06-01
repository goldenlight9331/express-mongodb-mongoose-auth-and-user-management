import path, { dirname } from "path";
import { fileURLToPath } from "url";

import { env } from "#config/index.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const uploadDirectory = path.join(__dirname, "../../public/uploads");
const viewsDirectory = path.join(__dirname, "../views");

const { NODE_ENV } = env;

const backendUrl =
  NODE_ENV === "production"
    ? "https://api.yourDomain.com"
    : "http://localhost:5000";

const frontendUrl =
  NODE_ENV === "production"
    ? "https://www.yourDomain.com"
    : "http://localhost:3000";

export { uploadDirectory, viewsDirectory, backendUrl, frontendUrl };
