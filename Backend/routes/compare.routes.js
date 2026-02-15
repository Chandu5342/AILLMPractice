import express from "express";
import { compareController } from "../controllers/compare.controller.js";

const router = express.Router();

router.post("/", compareController);

export default router;
