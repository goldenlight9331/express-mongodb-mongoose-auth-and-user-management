import { asyncHandler } from "#utils/index.js";
import emailService from "./email.service.js";

const emailController = {
  verify: asyncHandler(async (req, res) => {
    const { verificationToken } = req.params;
    const result = await emailService.verify(verificationToken);
    res.status(200).send(result);
  }),

  send: asyncHandler(async (req, res) => {
    const { email } = req.body;
    const result = await emailService.send(email);
    res.status(200).send(result);
  }),
};

export default emailController;
