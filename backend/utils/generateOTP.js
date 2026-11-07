
import crypto from "crypto";

// Generate a six-digit OTP
const generateOtp = () => {
  return crypto.randomInt(100000, 1000000).toString();
};

export default generateOtp;
