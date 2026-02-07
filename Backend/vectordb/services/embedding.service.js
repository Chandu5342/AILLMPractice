import { generateEmbedding as baseEmbedding } from "../../utils/embeddingsClients.js";
import { retryIfRateLimited } from "../../utils/retry.js";

export async function generateEmbedding(text) {
  return retryIfRateLimited(
    () => baseEmbedding(text),
    { maxRetries: 3 }
  );
}
