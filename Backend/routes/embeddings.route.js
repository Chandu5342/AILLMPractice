import express from "express";
import {
  createEmbedding,
  compareEmbeddings,
  listEmbeddings
} from "../controllers/embeddings.controller.js";

const router = express.Router();

router.post("/create", createEmbedding);
router.post("/compare", compareEmbeddings);
router.get("/list", listEmbeddings);

export default router;
