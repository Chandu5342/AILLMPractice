import express from "express";
import { ingestSizeController } from "../controllers/ingestSize.controller.js";
import { ingestTopicController } from "../controllers/ingestTopic.controller.js";
import { ingestHybridController } from "../controllers/ingestHybrid.controller.js";

const router = express.Router();

router.post("/size", ingestSizeController);
router.post("/topic", ingestTopicController);
router.post("/hybrid", ingestHybridController);

export default router;
