import { express } from '#packages/index.js';
import { AuthController } from '#controllers/index.js';
import { validate } from '#middlewares/index.js';
import dtos from '#dtos/index.js';

const authRoutes = express.Router();

authRoutes
  .post('/signup', validate.dto(dtos.signUp), AuthController.signUp)
  .post('/signin', validate.dto(dtos.signIn), AuthController.signIn)
  .post('/signout', validate.authToken, AuthController.signOut);

export default authRoutes;
