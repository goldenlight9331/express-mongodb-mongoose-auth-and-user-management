import { express } from "#packages/index.js";

import { connectDatabase } from "#config/index.js";
import startServer from "#server/index.js";
import { applyGlobalMiddleware } from "#middleware/index.js";
import createRoutes from "#routes/index.js";

const app = express();

connectDatabase();
startServer(app);
applyGlobalMiddleware(app);
createRoutes(app);

export default app;
