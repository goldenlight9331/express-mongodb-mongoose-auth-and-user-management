import { express } from "#packages/index.js";
import connectDatabase from "#database/index.js";
import { startServer } from "#server/index.js";
import { applyMiddlewares } from "#middlewares/index.js";
import configRoutes from "#routes/index.js";

const app = express();

connectDatabase();
startServer(app);
applyMiddlewares(app);
configRoutes(app);

export default app;
