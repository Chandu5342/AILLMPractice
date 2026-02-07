// utils/embeddingsStore.js

let embeddingsStore = [];
let idCounter = 1;

/**
 * Save embedding in memory
 */
export function saveEmbedding(text, vector, provider) {
  const record = {
    id: idCounter++,
    text,
    vector,
    provider,
    createdAt: new Date().toISOString(),
  };

  embeddingsStore.push(record);
  return record;
}

/**
 * Get all stored embeddings
 */
export function getAllEmbeddings() {
  return embeddingsStore;
}
