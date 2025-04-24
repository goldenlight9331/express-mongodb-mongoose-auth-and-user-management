import { asyncHandler } from "#utils/index.js";
import otpService from "./otp.service.js";

const otpController = {
  send: asyncHandler(async (req, res) => {
    const payload = req.body;
    const result = await otpService.send(payload);
    res.status(200).json(result);
  }),

  verify: asyncHandler(async (req, res) => {
    const payload = req.body;
    const result = await otpService.verify(payload);
    res.status(200).json(result);
  }),
};

export default otpController;
