// controllers/semanticSearch.controller.js
import { generateEmbedding } from "../utils/embeddingsClients.js";
import { cosineSimilarity } from "../utils/cosineSimilarity.js";
import { retryIfRateLimited } from "../utils/retry.js";
import { logAIHistory } from "../utils/historyLogger.js";

// In-memory storage for dataset + embeddings
let embeddingsStore = [];

/**
 * Initialize embeddings for a dataset (precompute)
 * @param {string[]} dataset 
 */
export async function initEmbeddings(dataset) {
  embeddingsStore = [];
  for (const text of dataset) {
    const vector = await retryIfRateLimited(() => generateEmbedding(text), { maxRetries: 3 });
    embeddingsStore.push({ text, vector });
  }
}

/**
 * Semantic Search Handler
 */
export async function handleSemanticSearch(req, res) {
  try {
    const { query, texts, topK = 3, threshold = 0.6 } = req.body;

    if (!query) return res.status(400).json({ error: "Query is required" });
    if (!texts || !Array.isArray(texts) || texts.length === 0) {
      return res.status(400).json({ error: "texts[] array required" });
    }

    // Precompute embeddings for dynamic dataset if new
    // If embeddingsStore is empty or dataset changed, re-init
    const datasetChanged = embeddingsStore.length !== texts.length ||
      embeddingsStore.some((item, i) => item.text !== texts[i]);

    if (datasetChanged) {
      await initEmbeddings(texts);
    }

    // Generate embedding for query with retry
    const queryVector = await retryIfRateLimited(() => generateEmbedding(query), { maxRetries: 3 });

    // Compute similarity with all texts
    const results = embeddingsStore
      .map(item => ({
        text: item.text,
        similarity: cosineSimilarity(queryVector, item.vector)
      }))
      .filter(item => item.similarity >= threshold)  // threshold filtering
      .sort((a, b) => b.similarity - a.similarity)   // descending

    // Pagination / top-K
    const topResults = results.slice(0, topK);

    // Log query + top result
    logAIHistory({
      intent: "semantic-search",
      query,
      topResult: topResults[0] ?? null,
      topK,
      threshold
    });

    return res.json(topResults);

  } catch (err) {
    console.error("Semantic search error →", err.message);
    return res.status(500).json({ error: err.message });
  }
}
