import { path, dirname, express, fileURLToPath } from "#packages/index.js";

import { authRoutes, userRoutes, emailRoutes } from "#modules/index.js";
import {
  verifyAuthToken,
  errorHandler,
  invalidRouteHandler,
} from "#middleware/index.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const rootRouter = express.Router();
const v1Router = express.Router();

rootRouter.get("/", (_, res) => {
  res.json({ message: "Server is working..." });
});

rootRouter.use("/api/v1", v1Router);

v1Router.use("/", authRoutes);
v1Router.use("/", emailRoutes);
v1Router.use("/users", verifyAuthToken, userRoutes);

const createRoutes = (app) => {
  app.use(
    "/uploads",
    express.static(path.join(__dirname, "../../public/uploads")),
  );
  app.use(rootRouter);
  app.use(errorHandler);
  app.use("*", invalidRouteHandler);
};

export default createRoutes;
