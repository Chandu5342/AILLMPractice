// controllers/askAdvancedController.js
import { getAIResponseAdvanced } from "../utils/aiClientsAdvanced.js";
import { retryIfRateLimited } from "../utils/retry.js";
import { logAIHistory } from "../utils/historyLogger.js";

export async function handleAdvancedPrompt(req, res) {
  try {
    const { systemPrompt, messages, provider } = req.body;

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return res.status(400).json({ error: "messages[] required" });
    }

    // Format messages for LLM
    const formattedMessages = [];

    if (systemPrompt) {
      formattedMessages.push({
        role: "system",
        content: systemPrompt,
      });
    }

    messages.forEach(msg => {
      formattedMessages.push({
        role: "user",
        content: msg,
      });
    });

    // Prepare AI call function for retry
    const callModel = async () =>
      await getAIResponseAdvanced(formattedMessages, provider);

    const result = await retryIfRateLimited(callModel, {
      maxRetries: 3,
      onRetry: (attempt, err) =>
        console.log(`Retry #${attempt} → rate limited → retrying...`)
    });

    // Log conversation
    logAIHistory({
      provider: result.provider,
      systemPrompt,
      userMessages: messages,
      response: result.text,
    });

    return res.json(result);

  } catch (err) {
    console.error("Advanced prompt error →", err.message);

    return res.status(500).json({
      error: "Server failed processing advanced prompt",
      details: err.message,
    });
  }
}
