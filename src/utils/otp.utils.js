import { randomInt } from "crypto";
import bcrypt from "bcryptjs";

export async function generateOtp() {
  const rawOtp = randomInt(100000, 999999).toString();

  const salt = await bcrypt.genSalt(10);
  const hashedOtp = await bcrypt.hash(rawOtp, salt);

  const expiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes

  return { rawOtp, hashedOtp, expiresAt };
}
