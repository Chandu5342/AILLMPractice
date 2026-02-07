import db from "../../db/mysql.js";
import { advancedSearchPipeline } from "../services/vectorSearch.v2.service.js";

export async function hybridSearch({ query, year }) {
  // 1️⃣ SQL filter
  const [rows] = await db.query(
    "SELECT content FROM documents WHERE year = ?",
    [year]
  );

  const texts = rows.map(r => r.content);

  // 2️⃣ Vector search on SQL-filtered docs
  return await advancedSearchPipeline({
    query,
    topK: 5,
    metadata: {}
  });
}
