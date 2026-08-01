import jwt from "jsonwebtoken";
import User from "../models/User.js";

export const protect = async (req, res, next) => {
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }

  if (!token) {
    return res
      .status(401)
      .json({ message: "Not authorized, no token provided" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.id).select("-password");
    if (!req.user) {
      return res.status(401).json({ message: "Not authorized, user not found" });
    }
    if (req.user.status === "suspended") {
      return res.status(403).json({ message: "Your account has been suspended. Contact support." });
    }
    if (!req.user.isVerified) {
      return res
        .status(403)
        .json({
          code: "UNVERIFIED",
          message: "Please verify your email before logging in.",
        });
    }
    next();
  } catch {
    return res.status(401).json({ message: "Not authorized, token failed" });
  }
};

export const adminOnly = (req, res, next) => {
  if (req.user && req.user.role === "admin") {
    next();
  } else {
    return res.status(403).json({ message: "Access denied. Admin only." });
  }
};

// Effective role derived from the user record:
//   admin  -> role === "admin"
//   poster -> accountType === "poster" (Job Poster / Employer)
//   applicant -> accountType === "seeker" (or legacy users without accountType)
export const getRole = (user) => {
  if (!user) return null;
  if (user.role === "admin") return "admin";
  if (user.accountType === "poster") return "poster";
  return "applicant";
};

export const requireRole = (...roles) => (req, res, next) => {
  const role = getRole(req.user);
  if (!roles.includes(role)) {
    return res
      .status(403)
      .json({ message: "Access denied. You do not have permission to perform this action." });
  }
  next();
};
