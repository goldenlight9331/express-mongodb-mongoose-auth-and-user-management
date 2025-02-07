import { express } from "#packages/index.js";

import connectDatabase from "#database/index.js";
import startServer from "#server/index.js";
import middleware from "#middleware/index.js";
import createRoutes from "#routes/index.js";

const app = express();
const { applyGlobalMiddleware } = middleware;

connectDatabase();
startServer(app);
applyGlobalMiddleware(app);
createRoutes(app);

export default app;
