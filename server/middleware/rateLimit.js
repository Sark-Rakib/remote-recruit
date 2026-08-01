import rateLimit from "express-rate-limit";

const minute = 60 * 1000;

export const registerLimiter = rateLimit({
  windowMs: 15 * minute,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: "Too many signup attempts. Please try again later." },
});

export const loginLimiter = rateLimit({
  windowMs: 15 * minute,
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: "Too many sign-in attempts. Please try again later." },
});

export const resendLimiter = rateLimit({
  windowMs: 15 * minute,
  max: 5,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    message: "Too many verification emails requested. Please try again later.",
  },
});
