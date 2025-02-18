import fs from "fs";
import path from "path";

import { logger, env, transporter } from "#config/index.js";
import { viewsDirectory, backendUrl, frontendUrl } from "#constants/index.js";

const { USER_EMAIL } = env;

const readEmailTemplate = (folder, filename) => {
  const filePath = path.join(viewsDirectory, folder, filename);
  return fs.readFileSync(filePath, "utf-8");
};

const sendVerificationEmail = async (email, verificationToken) => {
  let emailHtml = readEmailTemplate("verification-email", "index.html")
    .replace("${backendUrl}", backendUrl)
    .replace("${verificationToken}", verificationToken);

  const mailOptions = {
    from: USER_EMAIL,
    to: email,
    subject: "Welcome to our platform - Verify your email",
    html: emailHtml,
  };

  await transporter.sendMail(mailOptions);

  logger.info(`Verification email sent to ${email}`);

  return true;
};

const sendVerificationNotification = () => {
  return readEmailTemplate("verification-notification", "index.html").replace(
    "${frontendUrl}",
    frontendUrl,
  );
};

export { sendVerificationEmail, sendVerificationNotification };
