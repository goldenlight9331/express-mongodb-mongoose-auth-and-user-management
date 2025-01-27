import utility from "#utility/index.js";
import { AuthService } from "#services/index.js";

const { asyncHandler } = utility;

export const AuthController = {
  signUp: asyncHandler(async (req, res) => {
    const userData = req.body;
    const result = await AuthService.signUp(userData);
    res.status(201).json(result);
  }),

  signIn: asyncHandler(async (req, res) => {
    const userData = req.body;
    const result = await AuthService.signIn(userData);
    const token = result.token;
    res
      .status(200)
      .set("Authorization", `Bearer ${token}`)
      .json({ ...result, token: undefined });
  }),

  signOut: asyncHandler(async (req, res) => {
    const token = req.headers.authorization.split(" ")[1];
    const result = await AuthService.signOut(token);
    res.status(200).json(result);
  }),

  forgotPassword: asyncHandler(async (req, res) => {
    const { email } = req.params;
    const { password } = req.body;
    const result = await AuthService.forgotPassword(email, password);
    res.status(200).json(result);
  }),
};
