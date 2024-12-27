import { express } from '#packages/index.js';
import { AuthController } from '#controllers/index.js';
import { validateMiddleware } from '#middlewares/index.js';
import { signUpSchema, signInSchema } from '#validations/index.js';

export const authRoutes = express.Router();

authRoutes
  .post('/signup', validateMiddleware(signUpSchema), AuthController.signUp)
  .post('/signin', validateMiddleware(signInSchema), AuthController.signIn)
  .post('/signout', AuthController.signOut);
