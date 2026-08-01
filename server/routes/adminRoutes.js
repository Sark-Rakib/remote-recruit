import { Router } from "express";
import { protect, adminOnly } from "../middleware/auth.js";
import {
  getStats,
  getUsers,
  updateUserStatus,
  deleteUser,
  getJobs,
  deleteJob,
  getApplications,
  deleteApplication,
} from "../controllers/adminController.js";

const router = Router();

router.use(protect, adminOnly);

router.get("/stats", getStats);
router.get("/users", getUsers);
router.patch("/users/:id/status", updateUserStatus);
router.delete("/users/:id", deleteUser);

router.get("/jobs", getJobs);
router.delete("/jobs/:id", deleteJob);

router.get("/applications", getApplications);
router.delete("/applications/:id", deleteApplication);

export default router;
