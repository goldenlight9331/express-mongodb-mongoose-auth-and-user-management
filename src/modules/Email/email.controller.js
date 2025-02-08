import utilities from "#utilities/index.js";
import emailService from "./email.service.js";

const { asyncHandler } = utilities;

const emailController = {
  verifyEmail: asyncHandler(async (req, res) => {
    const { verificationToken } = req.params;
    const result = await emailService.verifyEmail(verificationToken);
    res.status(200).send(result);
  }),

  sendVerificationEmail: asyncHandler(async (req, res) => {
    const { email } = req.body;
    const result = await emailService.sendVerificationEmail(email);
    res.status(200).send(result);
  }),
};

export default emailController;
