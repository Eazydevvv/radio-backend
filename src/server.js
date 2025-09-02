import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import morgan from 'morgan';
import path from 'path';
import { fileURLToPath } from 'url';


import './config/db.js';
import errorHandler from './middleware/errorHandler.js';
import routes from './routes/index.js';
import newsRoutes from "./routes/news.js";
import eventRoutes from "./routes/event.routes.js";
import podcastRoutes from "./routes/podcasts.routes.js";
import authRoutes from "./routes/auth.routes.js";

dotenv.config();
const app = express();


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);



// Middlewares
app.use(cors());
app.use(morgan('dev'));
app.use(express.json({ limit: '5mb' }));
app.use(express.urlencoded({ extended: true }));


// Static folder for uploads
app.use('/uploads', express.static(path.join(__dirname, '../..', 'uploads')));


// Routes
app.use('/api', routes);
app.use("/api/news", newsRoutes);
app.use("/api/events", eventRoutes);
app.use("/api/podcasts", podcastRoutes);

// Health check
app.get('/', (_req, res) => {
    res.json({ status: 'ok', service: 'radio-backend' });
});


// Error handler
app.use(errorHandler);


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));