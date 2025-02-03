import { path, dirname, express, fileURLToPath } from "#packages/index.js";
import { validate } from "#middlewares/index.js";
import utilities from "#utilities/index.js";
import authRoutes from "./Auth/index.js";
import userRoutes from "./User/index.js";
import emailRoutes from "./Email/index.js";

const { logger } = utilities;
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
v1Router.use(
  "/user",
  validate.authToken,
  validate.authRole("admin"),
  userRoutes,
);

v1Router.use("*", (_, res) => {
  res.status(404).json({ message: "Endpoint not found" });
});

const configRoutes = (app) => {
  app.use("/uploads", express.static(path.join(__dirname, "../../uploads")));
  app.use(rootRouter);

  app.use((err, req, res, next) => {
    const {
      status = 400,
      message = "Internal Server Error",
      stack,
      details,
    } = err;
    logger.error(
      JSON.stringify(
        {
          status,
          method: req.method,
          message,
          path: req.originalUrl,
          stack,
        },
        null,
        2,
      ),
    );
    res.status(status).json({
      error: {
        status,
        message,
      },
    });
  });
};

export default configRoutes;
