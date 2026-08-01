import { Router } from "express";
import { uploadCV, uploadErrorHandler } from "../middleware/upload.js";
import { protect, adminOnly } from "../middleware/auth.js";
import {
  submitApplication,
  getApplications,
  getApplication,
  getApplicationCV,
  updateApplicationStatus,
  addApplicationNote,
  deleteApplication,
} from "../controllers/applicationController.js";

const router = Router();

router.post("/", uploadCV.single("cv"), submitApplication);
router.get("/", protect, getApplications);
router.get("/:id/cv", protect, getApplicationCV);
router.get("/:id", protect, getApplication);
router.put("/:id/status", protect, updateApplicationStatus);
router.post("/:id/notes", protect, addApplicationNote);
router.delete("/:id", protect, adminOnly, deleteApplication);

router.use(uploadErrorHandler);

export default router;
