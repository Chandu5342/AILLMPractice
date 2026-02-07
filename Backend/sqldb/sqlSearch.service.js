import { generateEmbedding } from "../utils/embeddingsClients.js";
import { cosineSimilarity } from "../utils/cosineSimilarity.js";
import { retryIfRateLimited } from "../utils/retry.js";
import { insertEmbedding, getAllEmbeddings } from "./sqlEmbeddingRepo.js";

export async function insertTextsSQL(texts = []) {
  for (const text of texts) {
    const embedding = await retryIfRateLimited(
      () => generateEmbedding(text),
      { maxRetries: 3 }
    );
    await insertEmbedding(text, embedding);
  }
}

export async function sqlSemanticSearch(query, topK = 3) {
  const queryEmbedding = await retryIfRateLimited(
    () => generateEmbedding(query),
    { maxRetries: 3 }
  );

  const all = await getAllEmbeddings();

  return all
    .map(item => ({
      text: item.text,
      similarity: cosineSimilarity(queryEmbedding, item.vector)
    }))
    .sort((a, b) => b.similarity - a.similarity)
    .slice(0, topK);
}
