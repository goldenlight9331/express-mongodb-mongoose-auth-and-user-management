import fs from "fs";
import path from "path";

import { logger, env, transporter } from "#config/index.js";
import { viewsDirectory, backendUrl, frontendUrl } from "#constants/index.js";

const { USER_EMAIL } = env;

const readEmailTemplate = (folder, filename) => {
  const filePath = path.join(viewsDirectory, folder, filename);
  return fs.readFileSync(filePath, "utf-8");
};

export const sendVerificationEmail = async (email, verificationToken) => {
  const emailHtml = readEmailTemplate("verification-email", "index.html")
    .replace(/\$\{backendUrl\}/g, backendUrl)
    .replace(/\$\{verificationToken\}/g, verificationToken);

  const mailOptions = {
    from: USER_EMAIL,
    to: email,
    subject: "Welcome to Vocora - Verify your email",
    html: emailHtml,
  };

  await transporter.sendMail(mailOptions);

  logger.info(`Verification email sent to ${email}`);

  return true;
};

export const sendOtpEmail = async (email, otpCode) => {
  const emailHtml = readEmailTemplate("otp-email", "index.html").replace(
    /\$\{otpCode\}/g,
    otpCode,
  );

  const mailOptions = {
    from: USER_EMAIL,
    to: email,
    subject: "Vocora - Password Reset Code",
    html: emailHtml,
  };

  await transporter.sendMail(mailOptions);

  logger.info(`OTP email sent to ${email}`);

  return true;
};

export const sendVerificationNotification = () => {
  return readEmailTemplate("verification-notification", "index.html").replace(
    /\$\{frontendUrl\}/g,
    frontendUrl + "/signin",
  );
};
