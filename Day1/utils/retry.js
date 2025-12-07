// utils/retry.js
async function retryIfRateLimited(func, options = {}) {
  const maxRetries = options.maxRetries ?? 3;
  let attempt = 0;
  while (true) {
    try {
      return await func();
    } catch (err) {
      attempt++;
      const shouldRetry = (err?.statusCode === 429 || err?.status === 429 || err?.message?.includes("rate limit"));
      if (!shouldRetry || attempt > maxRetries) {
        // no more retries
        throw err;
      }
      // Exponential backoff with jitter
      const backoffMs = Math.min(1000 * Math.pow(2, attempt), 10000) + Math.floor(Math.random() * 300);
      if (options.onRetry) options.onRetry(attempt, err);
      await new Promise(res => setTimeout(res, backoffMs));
    }
  }
}

export { retryIfRateLimited };
