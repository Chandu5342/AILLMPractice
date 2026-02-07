import { getAIResponse } from "../utils/aiClients.js";
import { retryIfRateLimited } from "../utils/retry.js";

const askController = async (req, res) => {
  try {
    const { prompt } = req.body;
    if (!prompt || typeof prompt !== "string") {
      return res.status(400).json({ success: false, error: "Please provide a prompt string." });
    }

    const callModel = async () => {
      return await getAIResponse(prompt);
    };

    const result = await retryIfRateLimited(callModel, {
      maxRetries: Number(process.env.MAX_RETRIES || 3),
      onRetry: (attempt, err) =>
        console.log(`Retry attempt ${attempt} due to ${err?.message || err}`),
    });

    return res.json({ success: true, provider: result.provider, text: result.text });
  } catch (err) {
    console.error("askController error:", err);
    const status = err?.statusCode || 500;
    return res.status(status).json({ success: false, error: err.message || "Internal Server Error" });
  }
};

export default askController;
