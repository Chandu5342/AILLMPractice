import express from 'express';
import { healthCheck } from '../controllers/healthController.js';
import { logger } from '../utils/logger.js';
const router = express.Router();

router.get('/', healthCheck);

//router.get('/', (req, res,next) => {
  //  logger(req);
  //  next();
//}, healthCheck);   
export default router;