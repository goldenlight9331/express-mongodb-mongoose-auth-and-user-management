import { path, dirname, express, fileURLToPath } from "#packages/index.js";

import { authRoutes, userRoutes, emailRoutes } from "#modules/index.js";
import middleware from "#middleware/index.js";

const { verifyAuthToken, errorHandler, invalidRouteHandler } = middleware;

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const rootRouter = express.Router();
const v1Router = express.Router();

rootRouter.get("/", (_, res) => {
  res.json({ message: "Server is working..." });
});

rootRouter.use("/api/v1", v1Router);

v1Router.use("/auth", authRoutes);
v1Router.use("/email", emailRoutes);
v1Router.use("/user", verifyAuthToken, userRoutes);

const createRoutes = (app) => {
  app.use("/uploads", express.static(path.join(__dirname, "../../uploads")));
  app.use(rootRouter);
  app.use(errorHandler);
  app.use("*", invalidRouteHandler);
};

export default createRoutes;
