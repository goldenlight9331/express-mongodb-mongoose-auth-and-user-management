import { asyncHandler } from "#utils/index.js";
import { env } from "#config/index.js";
import authService from "./auth.service.js";

const {
  NODE_ENV,
  COOKIE_NAME,
  COOKIE_HTTP_ONLY,
  COOKIE_SAME_SITE,
  COOKIE_SHORT_EXPIRY,
  COOKIE_LONG_EXPIRY,
  COOKIE_PATH,
} = env;

const getCookieOptions = (isRemembered) => {
  return {
    httpOnly: COOKIE_HTTP_ONLY, // Important:  Prevent client-side JavaScript access
    secure: NODE_ENV === "production", // Send only over HTTPS in production
    sameSite: COOKIE_SAME_SITE, // Prevent CSRF attacks
    maxAge: isRemembered ? COOKIE_LONG_EXPIRY : COOKIE_SHORT_EXPIRY,
    path: COOKIE_PATH, // Cookie is valid for the entire domain
  };
};

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

    if (!COOKIE_NAME) {
      throw new Error("COOKIE_NAME environment variable is not set");
    }

    const options = getCookieOptions(userData.isRemembered);

    res
      .status(200)
      .cookie(COOKIE_NAME, token, { ...options, maxAge: undefined })
      .json({ ...result, token: undefined });
  }),

  signOut: asyncHandler(async (req, res) => {
    const token = req.cookies[COOKIE_NAME];
    if (!token) {
      return res.status(400).json({ message: "No token found" });
    }

    const result = await authService.signOut(token);

    const options = getCookieOptions(false);
    res.clearCookie(COOKIE_NAME, {
      ...options,
      maxAge: undefined,
    });

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
