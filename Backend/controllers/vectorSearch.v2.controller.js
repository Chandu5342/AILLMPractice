import { advancedSearchPipeline } from "../vectordb/services/vectorSearch.v2.service.js";
import { logAIHistory } from "../utils/historyLogger.js";

export async function advancedVectorSearch(req, res) {
  const {
    query,
    topK = 5,
    useRewrite = false,
    metadata = {}
  } = req.body;

  const trace = await advancedSearchPipeline({
    query,
    topK,
    useRewrite,
    metadata
  });

  logAIHistory({
    intent: "vector-search-v2",
    query,
    finalCount: trace.finalResults.length
  });

  res.json(trace);
}
