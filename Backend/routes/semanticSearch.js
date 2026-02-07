import express from "express";
import { handleSemanticSearch } from "../controllers/semanticSearch.controller.js";

const router = express.Router();

// POST /semantic-search
router.post("/", handleSemanticSearch);

export default router;
