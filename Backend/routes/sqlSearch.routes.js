import express from "express";
import { addSqlDocs, searchSql } from "../controllers/sqlSearchController.js";

const router = express.Router();

router.post("/insert", addSqlDocs);
router.post("/search", searchSql);

export default router;
