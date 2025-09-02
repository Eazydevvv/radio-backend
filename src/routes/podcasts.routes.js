import { Router } from "express";
import multer from "multer";
import { body } from "express-validator";
import {
  listPodcasts,
  getPodcast,
  createPodcast,
  updatePodcast,
  deletePodcast,
} from "../controllers/podcasts.controller.js";
import { requireAuth } from "../middleware/auth.js";

const router = Router();
const upload = multer({ dest: "uploads/" });

// Public
router.get("/", listPodcasts);
router.get("/:id", getPodcast);

// Protected
router.post(
  "/",
  requireAuth,
  upload.single("coverImage"),
  [
    body("title").notEmpty(),
    body("description").notEmpty(),
    body("host").notEmpty(),
    body("duration").notEmpty(),
  ],
  createPodcast
);

router.put("/:id", requireAuth, upload.single("coverImage"), updatePodcast);
router.delete("/:id", requireAuth, deletePodcast);

export default router;
