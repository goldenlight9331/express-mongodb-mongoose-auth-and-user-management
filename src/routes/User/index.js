import { express } from "#packages/index.js";
import { UserController } from "#controllers/index.js";
import { uploadFiles } from "../../multer/index.js";

const userRoutes = express.Router();

userRoutes
  .get("/get-all", UserController.getAll)
  .get("/get-by-id/:userId", UserController.getById)
  .patch("/update-by-id/:userId", uploadFiles, UserController.updateById)
  .delete("/delete-by-id/:userId", UserController.deleteById);

export default userRoutes;
