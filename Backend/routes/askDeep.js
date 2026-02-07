import express from 'express';
import { handleDeepPrompt } from '../controllers/askDeepController.js';

const router = express.Router();

// POST /ask-ai-deep
router.post('/', handleDeepPrompt);

export default router;
