import crypto from "crypto";
import User from "../models/User.js";

// Verification-token service. All token creation / validation / clearing lives
// here so controllers stay thin and the logic is reusable across register and
// resend flows.

const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:5173";
export const VERIFICATION_TOKEN_TTL_MS = 24 * 60 * 60 * 1000;

// Generates a cryptographically secure random token, stamps it (with expiry)
// on the user document, and returns the full verification URL.
export const createVerificationToken = (user) => {
  const token = crypto.randomBytes(32).toString("hex");
  user.verificationToken = token;
  user.verificationExpires = new Date(Date.now() + VERIFICATION_TOKEN_TTL_MS);
  return `${FRONTEND_URL}/verify-email/${token}`;
};

// Returns the user whose token is valid (present AND not expired), or null.
export const findUserByValidToken = async (token) => {
  if (!token) return null;
  return User.findOne({
    verificationToken: token,
    verificationExpires: { $gt: new Date() },
  });
};

// Returns the user that owns a token even if it already expired — used to
// prefill the resend form on the "verification failed" page.
export const findUserByToken = async (token) => {
  if (!token) return null;
  return User.findOne({ verificationToken: token });
};

export const clearVerificationToken = (user) => {
  user.verificationToken = undefined;
  user.verificationExpires = undefined;
};

export const isTokenExpired = (user) =>
  !user.verificationExpires || user.verificationExpires.getTime() < Date.now();
