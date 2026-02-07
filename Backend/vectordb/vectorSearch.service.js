import { getChromaCollection } from "./chromaCollection.js";
import { generateEmbedding } from "../utils/embeddingsClients.js";
import { retryIfRateLimited } from "../utils/retry.js";

export async function insertDocuments(texts = []) {
  const collection = await getChromaCollection();

  const embeddings = [];
  const ids = [];

  for (let i = 0; i < texts.length; i++) {
    const vector = await retryIfRateLimited(
      () => generateEmbedding(texts[i]),
      { maxRetries: 3 }
    );

    embeddings.push(vector);
    ids.push(`doc-${Date.now()}-${i}`);
  }

  await collection.add({
    ids,
    documents: texts,
    embeddings
  });

  return { inserted: texts.length };
}

export async function vectorSemanticSearch(query, topK = 3, threshold = 0.8) {
  const collection = await getChromaCollection();

  const queryEmbedding = await retryIfRateLimited(
    () => generateEmbedding(query), 
    { maxRetries: 3 }
  );

  const results = await collection.query({
    queryEmbeddings: [queryEmbedding],
    nResults: topK
  });
   console.log('Vector search results:', results.documents[0],results.distances[0]);
  return results.documents[0]
    .map((text, i) => ({
      text,
        distance: results.distances[0][i],
       similarity: 1 - results.distances[0][i]
    }))
    .filter(item => item.distance <= threshold) //  CORRECT
    .sort((a, b) => a.distance - b.distance);
}

export async function listVectorDocuments(limit = 50) {
  const collection = await getChromaCollection();

  const result = await collection.get({
    limit
  });

  return result.documents.map((text, i) => ({
    id: result.ids[i],
    text
  }));
}