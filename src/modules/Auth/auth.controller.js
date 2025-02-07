import utilities from "#utilities/index.js";
import authService from "./auth.service.js";

const { asyncHandler } = utilities;

const authController = {
  signUp: asyncHandler(async (req, res) => {
    const userData = req.body;
    const result = await authService.signUp(userData);
    res.status(201).json(result);
  }),

  signIn: asyncHandler(async (req, res) => {
    const userData = req.body;
    const result = await authService.signIn(userData);
    const token = result.token;
    res
      .status(200)
      .set("Authorization", `Bearer ${token}`)
      .json({ ...result, token: undefined });
  }),

  signOut: asyncHandler(async (req, res) => {
    const token = req.headers.authorization.split(" ")[1];
    const result = await authService.signOut(token);
    res.status(200).json(result);
  }),

  forgotPassword: asyncHandler(async (req, res) => {
    const { email } = req.params;
    const { password } = req.body;
    const result = await authService.forgotPassword(email, password);
    res.status(200).json(result);
  }),
};

export default authController;
