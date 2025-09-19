import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import morgan from 'morgan';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';
import connectDB from './config/db.js'; 
import errorHandler from './middleware/errorHandler.js';
import routes from './routes/index.js';
import newsRoutes from "./routes/news.js";
import eventRoutes from "./routes/event.routes.js";
import podcastRoutes from "./routes/podcasts.routes.js";
import authRoutes from "./routes/auth.routes.js";

import Podcast from './models/Podcast.js';

dotenv.config();
const app = express();

connectDB();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Middlewares
app.use(cors());
app.use(morgan('dev'));

// ✅ CRITICAL: Body parsers FIRST
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Static folder for uploads
app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')));

// ✅ Routes AFTER body parsers
app.use('/api', routes);
app.use("/api/news", newsRoutes);
app.use("/api/events", eventRoutes);
app.use("/api/podcasts", podcastRoutes); // ← Now this will work!
app.use("/api/auth", authRoutes);

// Health check
app.get('/', (_req, res) => {
    res.json({ status: 'ok', service: 'radio-backend' });
});

// Error handler
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
function startAutoDelete() {
    setInterval(async () => {
      try {
        // Delete podcasts older than 4 days
        const fourDaysAgo = new Date();
        fourDaysAgo.setDate(fourDaysAgo.getDate() - 4);
        
        // Find podcasts to delete
        const oldPodcasts = await Podcast.find({ 
          createdAt: { $lt: fourDaysAgo } 
        });
        
        if (oldPodcasts.length > 0) {
          console.log(`🗑️ Found ${oldPodcasts.length} podcasts to auto-delete`);
          
          // Delete from database
          await Podcast.deleteMany({ 
            createdAt: { $lt: fourDaysAgo } 
          });
          
          console.log(`✅ Auto-deleted ${oldPodcasts.length} podcasts older than 4 days`);
        }
      } catch (error) {
        console.error('❌ Auto-delete error:', error);
      }
    }, 60 * 60 * 1000); // Check every hour
  }
  
  // Start the auto-delete
  startAutoDelete();