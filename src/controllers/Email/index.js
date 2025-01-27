import utility from "#utility/index.js";
import { EmailService } from "#services/index.js";

const { asyncHandler } = utility;

export const EmailController = {
  verifyEmail: asyncHandler(async (req, res) => {
    const { verificationToken } = req.params;
    const result = await EmailService.verifyEmail(verificationToken);
    res.status(200).send(result);
  }),
};
