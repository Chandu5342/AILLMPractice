import { generateEmbedding } from "../utils/embeddingsClients.js";
import { cosineSimilarity } from "../utils/cosineSimilarity.js";
import { saveEmbedding, getAllEmbeddings } from "../utils/embeddingsStore.js";

// CREATE EMBEDDING
export async function createEmbedding(req, res) {
  const { text } = req.body;

  const embedding = await generateEmbedding(text);

  saveEmbedding({ text, embedding });

  res.json({
    provider: process.env.AI_PROVIDER,
    dimension: embedding.length
  });
}

// COMPARE EMBEDDINGS
export async function compareEmbeddings(req, res) {
  const { text1, text2 } = req.body;

  const emb1 = await generateEmbedding(text1);
  const emb2 = await generateEmbedding(text2);

  const similarity = cosineSimilarity(emb1, emb2);

  res.json({
    similarity,
    meaning:
      similarity > 0.8 ? "Very similar" :
      similarity > 0.5 ? "Related" :
      "Not similar"
  });
}

// LIST STORED EMBEDDINGS
export function listEmbeddings(req, res) {
  res.json(getAllEmbeddings());
}
