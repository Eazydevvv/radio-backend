// routes/podcast.js
import express from "express";
import multer from "multer";
import { uploadToR2 } from "../utils/r2.js";
import Podcast from "../models/Podcast.js";

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

// Upload podcast
router.post(
  "/",
  upload.fields([{ name: "image" }, { name: "audio" }]),
  async (req, res) => {
    try {
      const { title, description, host, duration } = req.body;

      // Upload files to R2
      const imageFile = req.files["image"]?.[0];
      const audioFile = req.files["audio"]?.[0];

      const imageUrl = imageFile
        ? await uploadToR2(imageFile, "images")
        : null;
      const audioUrl = audioFile
        ? await uploadToR2(audioFile, "audio")
        : null;

      const podcast = new Podcast({
        title,
        description,
        host,
        duration,
        image: imageUrl,
        audio: audioUrl,
      });

      await podcast.save();
      res.status(201).json(podcast);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Upload failed" });
    }
  }
);

export default router;
