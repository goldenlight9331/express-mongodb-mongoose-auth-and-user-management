import { fs, path, fileURLToPath, dirname } from "#packages/index.js";

import env from "#env/index.js";
import utilities from "#utilities/index.js";

const { USER_EMAIL, NODE_ENV } = env;
const { transporter, logger } = utilities;

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export default {
  sendVerificationEmail: async (toEmail, verificationToken) => {
    let verificationEmailHtml = fs.readFileSync(
      path.join(__dirname, "../../views/VerificationEmail", "index.html"),
      "utf-8",
    );

    verificationEmailHtml = verificationEmailHtml.replace(
      "${backendUrl}",
      `${NODE_ENV === "production" ? "https://api.domainName.org" : "http://localhost:5000"}`,
    );

    verificationEmailHtml = verificationEmailHtml.replace(
      "${verificationToken}",
      verificationToken,
    );

    const mailOptions = {
      from: USER_EMAIL,
      to: toEmail,
      subject: "Welcome to Our Platform 🙌",
      html: verificationEmailHtml,
    };

    const info = await transporter.sendMail(mailOptions);
    logger.info(`Email sent: ${info.response}`);
    return true;
  },
};
