import dtos from "#dtos/index.js";
import { express } from "#packages/index.js";
import { validate } from "#middlewares/index.js";
import { AuthController } from "#controllers/index.js";

const authRoutes = express.Router();

authRoutes
  .post("/signup", validate.dto(dtos.signUp), AuthController.signUp)
  .post("/signin", validate.dto(dtos.signIn), AuthController.signIn)
  .post("/signout", AuthController.signOut)
  .post(
    "/forgot-password",
    validate.dto(dtos.forgotPassword),
    AuthController.forgotPassword,
  );

export default authRoutes;
