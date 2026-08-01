import jwt from "jsonwebtoken";
import User from "../models/User.js";
import { sendVerificationEmail } from "../services/mailer.js";
import {
  createVerificationToken,
  findUserByValidToken,
  findUserByToken,
  clearVerificationToken,
} from "../services/verificationService.js";

const IS_PRODUCTION = process.env.NODE_ENV === "production";

const signToken = (user) => {
  return jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });
};

const publicUser = (user) => ({
  _id: user._id,
  firstName: user.firstName,
  lastName: user.lastName,
  email: user.email,
  role: user.role,
  accountType: user.accountType,
  isVerified: user.isVerified,
});

// ── Validation ───────────────────────────────────────────────────────────────
const isValidEmail = (email) => /^\S+@\S+\.\S+$/.test(email || "");

const validateRegistration = ({ firstName, lastName, email, password }) => {
  if (!firstName?.trim() || !lastName?.trim() || !email?.trim() || !password) {
    return { error: "All fields are required" };
  }
  if (!isValidEmail(email)) {
    return { error: "Please enter a valid email" };
  }
  if (typeof password !== "string" || password.length < 6) {
    return { error: "Password must be at least 6 characters" };
  }
  return { error: null };
};

const accountTypeOf = (value) => (value === "poster" ? "poster" : "seeker");

// Generic catch wrapper — log details server-side, never leak internals to the
// client.
const handleError = (res, error, label = "request") => {
  console.error(`❌ ${label} failed:`, error);
  res.status(500).json({ message: "Server error. Please try again." });
};

// ── Register ─────────────────────────────────────────────────────────────────
export const register = async (req, res) => {
  try {
    const { firstName, lastName, email, password, accountType } = req.body;

    const { error: validationError } = validateRegistration({
      firstName,
      lastName,
      email,
      password,
    });
    if (validationError) {
      return res.status(400).json({ message: validationError });
    }

    const existing = await User.findOne({ email: email.toLowerCase() });
    if (existing) {
      return res
        .status(400)
        .json({ message: "An account with this email already exists" });
    }

    const user = await User.create({
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      email: email.toLowerCase(),
      password,
      accountType: accountTypeOf(accountType),
    });
    console.log(`👤 [${user.email}] Account created — generating verification token`);

    const verificationUrl = createVerificationToken(user);
    await user.save();

    const result = await sendVerificationEmail({
      to: user.email,
      name: `${user.firstName} ${user.lastName}`.trim(),
      verificationUrl,
    });

    if (!result.success) {
      console.error(
        `❌ [${user.email}] Verification email failed to send:`,
        result.error?.message || result.error
      );
    }

    res.status(201).json({
      message: result.success
        ? "A verification email has been sent. Please check your inbox and verify your email before logging in."
        : "Your account was created, but the verification email could not be sent. Please use the resend option.",
      email: user.email,
      emailSent: result.success,
      ...(!result.success && {
        warning: `Verification email could not be sent: ${result.error?.message || "Unknown error"}`,
      }),
      ...(!IS_PRODUCTION && { verificationUrl }),
    });
  } catch (error) {
    handleError(res, error, "register");
  }
};

// ── Verify email ─────────────────────────────────────────────────────────────
export const verifyEmail = async (req, res) => {
  try {
    const { token } = req.params;

    const user = await findUserByValidToken(token);
    if (!user) {
      // Distinguish "expired" from "invalid" so the frontend can prefill the
      // resend form when we know who owns the (expired) token.
      const owner = await findUserByToken(token);
      if (owner) {
        return res.status(400).json({
          code: "EXPIRED",
          message:
            "This verification link has expired. Please request a new link.",
          email: owner.email,
        });
      }
      return res.status(400).json({
        code: "INVALID",
        message: "This verification link is invalid.",
      });
    }

    user.isVerified = true;
    clearVerificationToken(user);
    await user.save();

    console.log(`✅ [${user.email}] Email verified`);
    res.json({
      message: "Your email has been verified successfully.",
      user: publicUser(user),
    });
  } catch (error) {
    handleError(res, error, "verify email");
  }
};

// ── Resend verification email ────────────────────────────────────────────────
export const resendVerification = async (req, res) => {
  try {
    const { email } = req.body;

    if (!isValidEmail(email)) {
      return res.status(400).json({ message: "Please enter a valid email" });
    }

    const user = await User.findOne({ email: email.toLowerCase() });
    // Always return the same response for unknown / already-verified accounts
    // to avoid leaking which emails are registered.
    if (!user || user.isVerified) {
      return res.status(200).json({
        message:
          "If an account exists for this email, a new verification link has been sent.",
      });
    }

    const verificationUrl = createVerificationToken(user);
    await user.save();

    const result = await sendVerificationEmail({
      to: user.email,
      name: `${user.firstName} ${user.lastName}`.trim(),
      verificationUrl,
    });

    if (!result.success) {
      console.error(
        `❌ [${user.email}] Verification email re-send failed:`,
        result.error?.message || result.error
      );
    }

    res.json({
      message: result.success
        ? "A new verification link has been sent to your email."
        : "Your verification email could not be sent. Please try again shortly.",
      emailSent: result.success,
      ...(!result.success && {
        warning: `Verification email could not be sent: ${result.error?.message || "Unknown error"}`,
      }),
    });
  } catch (error) {
    handleError(res, error, "resend verification");
  }
};

// ── Login ────────────────────────────────────────────────────────────────────
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email?.trim() || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user || !user.password || !(await user.comparePassword(password))) {
      return res.status(401).json({ message: "Invalid email or password" });
    }
    if (user.status === "suspended") {
      return res
        .status(403)
        .json({ message: "Your account has been suspended. Contact support." });
    }
    if (!user.isVerified) {
      return res.status(403).json({
        code: "UNVERIFIED",
        message: "Please verify your email before logging in.",
      });
    }

    const appToken = signToken(user);
    res.json({ token: appToken, user: publicUser(user) });
  } catch (error) {
    handleError(res, error, "login");
  }
};

// ── Current user ─────────────────────────────────────────────────────────────
export const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("-password");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json({ user: publicUser(user) });
  } catch (error) {
    handleError(res, error, "get me");
  }
};
