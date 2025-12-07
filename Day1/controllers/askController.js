import { getOpenAIResponse, getGeminiResponse } from "../utils/aiClients.js";
import { retryIfRateLimited } from "../utils/retry.js";

const askController = async (req, res) => {
  try {
    const { prompt } = req.body;
    if (!prompt || typeof prompt !== "string") {
      return res.status(400).json({ success: false, error: "Please provide a prompt string." });
    }

    const provider = (process.env.AI_PROVIDER || "openai").toLowerCase();

    const callModel = async () => {
      if (provider === "gemini") {
        return await getGeminiResponse(prompt);
      } else {
        return await getOpenAIResponse(prompt);
      }
    };

    const result = await retryIfRateLimited(callModel, {
      maxRetries: Number(process.env.MAX_RETRIES || 3),
      onRetry: (attempt, err) => console.log(`Retry attempt ${attempt} due to ${err?.message || err}`)
    });

    return res.json({ success: true, provider, text: result.text });

  } catch (err) {
    console.error("askController error:", err);
    const status = err?.statusCode || 500;
    return res.status(status).json({ success: false, error: err.message || "Internal Server Error" });
  }
};

export default askController;
