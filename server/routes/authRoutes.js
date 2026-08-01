import { Router } from "express";
import {
  register,
  login,
  getMe,
  verifyEmail,
  resendVerification,
} from "../controllers/authController.js";
import { protect } from "../middleware/auth.js";
import { registerLimiter, loginLimiter, resendLimiter } from "../middleware/rateLimit.js";

const router = Router();

router.post("/register", registerLimiter, register);
router.post("/login", loginLimiter, login);
router.post("/resend-verification", resendLimiter, resendVerification);
router.get("/verify-email/:token", verifyEmail);
router.get("/me", protect, getMe);

export default router;
