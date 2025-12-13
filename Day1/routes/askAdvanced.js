// routes/askAdvanced.js
import express from "express";
import { handleAdvancedPrompt } from "../controllers/askAdvancedController.js";

const router = express.Router();

// POST /ask-ai-advanced
router.post("/", handleAdvancedPrompt);

export default router;
