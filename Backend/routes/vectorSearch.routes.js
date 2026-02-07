import express from "express";
import { addVectorDocs, searchVector,  listVectorDocs } from "../controllers/vectorSearchController.js";

const router = express.Router();

router.post("/insert", addVectorDocs);
router.post("/search", searchVector);
router.get("/list", listVectorDocs);
export default router;
