import { Router } from "express";
import {
  getJobs,
  getJob,
  getMyJobs,
  createJob,
  updateJob,
  deleteJob,
} from "../controllers/jobController.js";
import { protect, adminOnly, requireRole } from "../middleware/auth.js";

const router = Router();

router.get("/", getJobs);
router.get("/mine", protect, requireRole("poster", "admin"), getMyJobs);
router.get("/:id", getJob);
router.post("/", protect, requireRole("poster", "admin"), createJob);
router.put("/:id", protect, requireRole("poster", "admin"), updateJob);
router.delete("/:id", protect, adminOnly, deleteJob);

export default router;
