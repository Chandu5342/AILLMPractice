import { insertTextsSQL, sqlSemanticSearch } from "../sqldb/sqlSearch.service.js";

export async function addSqlDocs(req, res) {
  const { texts } = req.body;
  await insertTextsSQL(texts);
  res.json({ inserted: texts.length });
}

export async function searchSql(req, res) {
  const { query, topK } = req.body;
  const results = await sqlSemanticSearch(query, topK);
  res.json(results);
}
