import utility from "#utility/index.js";
import { express } from "#packages/index.js";
import { validate } from "#middlewares/index.js";
import authRoutes from "./Auth/index.js";
import userRoutes from "./User/index.js";

const { logger } = utility;

const rootRouter = express.Router();
const v1Router = express.Router();

rootRouter.get("/", (_, res) => {
  res.json({ message: "Server is active..." });
});

rootRouter.use("/api/v1", v1Router);

v1Router.use("/auth", authRoutes);
v1Router.use(
  "/user",
  validate.authToken,
  validate.authRole("ADMIN"),
  userRoutes,
);

v1Router.use("*", (_, res) => {
  res.status(404).json({ message: "Endpoint not found" });
});

const configRoutes = (app) => {
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
        method: req.method,
        message,
      },
    });
  });
};

export default configRoutes;
