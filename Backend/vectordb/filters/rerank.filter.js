import { normalizeSimilarity } from "./imilarity.normalize.js";

export function rerank(results) {
  return results
    .map(r => ({
      ...r,
      score: normalizeSimilarity(r.distance)
    }))
    .sort((a, b) => b.score - a.score);
}
