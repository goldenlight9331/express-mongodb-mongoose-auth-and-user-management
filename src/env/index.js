import { dotenv } from "#packages/index.js";

const isDevelopment = process.env.NODE_ENV === "development";

// Enable debug logs only in development
dotenv.config({ debug: isDevelopment });

export default process.env;
