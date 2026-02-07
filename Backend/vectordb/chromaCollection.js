import { chromaClient } from "./chromaClient.js";

const COLLECTION_NAME = "semantic_texts";

export async function getChromaCollection() {
  return await chromaClient.getOrCreateCollection({
    name: COLLECTION_NAME,
    metadata: { description: "Semantic search collection" }
  });
}
