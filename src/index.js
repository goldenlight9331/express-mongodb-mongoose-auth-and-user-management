import { express, colors } from '#utils/index.js';
import { listenServer } from '#server/index.js';
import {
  configureMiddlewares,
  connectDatabase,
  configureRoutes,
} from '#config/index.js';

const app = express();
export const io = listenServer(app);

connectDatabase();
configureMiddlewares(app);
configureRoutes(app);

export default app;
