// routes/ask.js


import express from 'express';
const router = express.Router();
import askController from '../controllers/askController.js';

// POST /ask-ai  (mounted in app.js)
router.post("/", askController);

export default router;
