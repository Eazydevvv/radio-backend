// models/Podcast.js
import mongoose from "mongoose";

const PodcastSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: String,
    host: String,
    duration: String,
    image: String,
    audio: String,
  },
  { timestamps: true }
);

export default mongoose.model("Podcast", PodcastSchema);
