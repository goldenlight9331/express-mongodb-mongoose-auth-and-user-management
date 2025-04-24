import { env } from "#config/index.js";

const {
  NODE_ENV,
  COOKIE_HTTP_ONLY,
  COOKIE_SAME_SITE,
  COOKIE_SHORT_EXPIRY,
  COOKIE_LONG_EXPIRY,
  COOKIE_PATH,
} = env;

export const getCookieOptions = (isRemembered) => {
  return {
    httpOnly: COOKIE_HTTP_ONLY, // Important:  Prevent client-side JavaScript access
    secure: NODE_ENV === "production", // Send only over HTTPS in production
    sameSite: COOKIE_SAME_SITE, // Prevent CSRF attacks
    maxAge: isRemembered ? COOKIE_LONG_EXPIRY : COOKIE_SHORT_EXPIRY,
    path: COOKIE_PATH, // Cookie is valid for the entire domain
  };
};
