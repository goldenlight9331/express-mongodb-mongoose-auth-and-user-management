import nodemailer from "nodemailer";

import { logger, env } from "./index.js";

const { EMAIL_HOST, EMAIL_PORT, USER_EMAIL, USER_PASSWORD, EMAIL_SERVICE } =
  env;

const createTransporter = () => {
  const transporter = nodemailer.createTransport({
    service: EMAIL_SERVICE,
    host: EMAIL_HOST,
    port: EMAIL_PORT,
    secure: false, // Set true for SSL (465), false for TLS (587)
    auth: { user: USER_EMAIL, pass: USER_PASSWORD },
    connectionTimeout: 60000,
    greetingTimeout: 30000,
    sendTimeout: 30000,
  });

  transporter.verify((error) => {
    if (error) {
      logger.error(`Email server connection error: ${error.message}`.red);
    } else {
      logger.info("Email server is ready to send messages.".brightMagenta);
    }
  });

  return transporter;
};

export const transporter = createTransporter();
