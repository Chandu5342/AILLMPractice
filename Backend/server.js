import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import healthRoutes from './routes/health.js';
import { logger } from './utils/logger.js';
import askAdvancedRoute from "./routes/askAdvanced.js";
import askRoutes from './routes/ask.js';
import emdedRoutes from './routes/embeddings.route.js';
import askDeepRoute from './routes/askDeep.js';
import semanticSearchRoute from "./routes/semanticSearch.js";
import  sqlSearchRoute from './routes/sqlSearch.routes.js';
import vectorSearchRoute from './routes/vectorSearch.routes.js'
import vector2SearchRoute from './routes/vectorSearch.v2.routes.js'
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use((req, res, next) => {
    logger(req);
   next();
});
app.use('/health', healthRoutes);


app.use("/ask-ai-advanced", askAdvancedRoute);//day2
app.use('/ask-ai-deep', askDeepRoute);//day3

app.use('/ask-ai', askRoutes);//day1
app.use('/embeddings', emdedRoutes);//day4
app.use("/semantic-search", semanticSearchRoute);//day5
app.use("/sql",sqlSearchRoute);
app.use("/vector",vectorSearchRoute);
app.use('/vector2',vector2SearchRoute);
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});