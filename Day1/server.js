import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import healthRoutes from './routes/health.js';
import { logger } from './utils/logger.js';

import askRoutes from './routes/ask.js';




const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use((req, res, next) => {
    logger(req);
   next();
});
app.use('/health', healthRoutes);
app.use('/ask-ai', askRoutes);
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});