import { insertDocuments, vectorSemanticSearch ,listVectorDocuments } from "../vectordb/vectorSearch.service.js";
import { logAIHistory } from "../utils/historyLogger.js";
export async function addVectorDocs(req, res) {
  const { texts } = req.body;

  const result = await insertDocuments(texts);

  logAIHistory({
    intent: "vector-insert",
    count: texts?.length ?? 0
  });

  res.json(result);
}

export async function searchVector(req, res) {
  const { query, topK = 3, threshold = 0.6 } = req.body;

  const results = await vectorSemanticSearch(query, topK, threshold);

  logAIHistory({
    intent: "vector-search",
    query,
    topResult: results[0] ?? null,
    topK,
    threshold
  });

  res.json(results);
}


export async function listVectorDocs(req, res) {
  const limit = Number(req.query.limit || 50);

  const docs = await listVectorDocuments(limit);

  res.json(docs);
}