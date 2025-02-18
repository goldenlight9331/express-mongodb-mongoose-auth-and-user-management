import swaggerJSDoc from "swagger-jsdoc";
import path, { dirname } from "path";
import { fileURLToPath } from "url";

import { env } from "#config/index.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const { NODE_ENV } = env;

const backendUrl =
  NODE_ENV === "production"
    ? "https://api.thesmarttowers.com"
    : "http://localhost:5000";

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "The Smart Towers API v1.0.0",
      version: "1.0.0",
      description: "API documentation with Swagger",
    },
    servers: [
      {
        url: backendUrl,
        description:
          NODE_ENV === "production"
            ? "Production server"
            : "Development server",
      },
    ],
  },
  apis: [
    path.join(__dirname, "../../docs/swagger/auth.swagger.yaml"),
    path.join(__dirname, "../../docs/swagger/user.swagger.yaml"),
  ],
};

export const swaggerSpec = swaggerJSDoc(options);
