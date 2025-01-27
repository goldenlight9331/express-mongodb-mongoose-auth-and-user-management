import { express } from "#packages/index.js";
import { EmailController } from "#controllers/index.js";

const emailRoutes = express.Router();

emailRoutes.get(
  "/verify-email/:verificationToken",
  EmailController.verifyEmail,
);

export default emailRoutes;
