import multer from "multer";
import path from "path";

const ALLOWED_MIMES = new Map([
  ["application/pdf", ".pdf"],
  ["application/msword", ".doc"],
  [
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ".docx",
  ],
]);

const MAX_FILE_SIZE = 4 * 1024 * 1024; // 4MB (kept under Vercel's ~4.5MB request-body limit)

const storage = multer.memoryStorage();

export const uploadCV = multer({
  storage,
  limits: { fileSize: MAX_FILE_SIZE, files: 1 },
  fileFilter: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    const allowedExt = [".pdf", ".doc", ".docx"];
    if (!ALLOWED_MIMES.has(file.mimetype) || !allowedExt.includes(ext)) {
      const err = new Error(
        "Invalid file type. Only PDF, DOC, or DOCX files are allowed."
      );
      err.status = 400;
      return cb(err);
    }
    cb(null, true);
  },
});

export const uploadErrorHandler = (err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    if (err.code === "LIMIT_FILE_SIZE") {
      return res.status(413).json({
        message: "File is too large. Maximum size is 4MB.",
      });
    }
    if (err.code === "LIMIT_FILE_COUNT") {
      return res.status(400).json({ message: "Only one file can be uploaded." });
    }
    return res.status(400).json({ message: err.message });
  }
  if (err) {
    return res.status(err.status || 400).json({ message: err.message });
  }
  next();
};
