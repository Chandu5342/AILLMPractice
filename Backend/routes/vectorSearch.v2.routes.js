import express from "express";
import { advancedVectorSearch } from "../controllers/vectorSearch.v2.controller.js";

const router = express.Router();

router.post("/search", advancedVectorSearch);

export default router;
