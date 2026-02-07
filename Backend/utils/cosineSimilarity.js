export function cosineSimilarity(vecA, vecB) {
  if (vecA.length !== vecB.length)
    throw new Error("Vector length mismatch");

  const dot = vecA.reduce((sum, val, i) => sum + val * vecB[i], 0);

  const magA = Math.sqrt(vecA.reduce((s, v) => s + v * v, 0));
  const magB = Math.sqrt(vecB.reduce((s, v) => s + v * v, 0));

  return dot / (magA * magB);
}
