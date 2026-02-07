import { getAIResponseDeep } from '../utils/aiClientsDeep.js';
import { retryIfRateLimited } from '../utils/retry.js';
import { logAIHistory } from '../utils/historyLogger.js';

export async function handleDeepPrompt(req, res) {
  try {
    const { systemPrompt, messages, examples, temperature, top_p, max_tokens, outputFormat } = req.body;

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return res.status(400).json({ error: "messages[] required" });
    }

    // Construct final prompt array
    const formattedMessages = [];

    // 1️⃣ Add system prompt
    if (systemPrompt) {
      formattedMessages.push({ role: "system", content: systemPrompt });
    }

    // 2️⃣ Add few-shot examples if provided
    if (examples && Array.isArray(examples)) {
      examples.forEach(ex => {
        formattedMessages.push({ role: "user", content: ex.input });
        formattedMessages.push({ role: "assistant", content: ex.output });
      });
    }

    // 3️⃣ Add user messages
    messages.forEach(msg => formattedMessages.push({ role: "user", content: msg }));

    // Prepare AI call function for retry
    const callModel = async () => getAIResponseDeep(formattedMessages, {
      temperature: temperature ?? 0.3,
      top_p: top_p ?? 0.9,
      max_tokens: max_tokens ?? 300,
      outputFormat: outputFormat ?? 'text'
    });

    const result = await retryIfRateLimited(callModel, {
      maxRetries: 3,
      onRetry: (attempt, err) => console.log(`Retry #${attempt} due to rate limit → ${err?.message}`)
    });

    // Log conversation
    logAIHistory({
      provider: result.provider,
      systemPrompt,
      userMessages: messages,
      examples,
      temperature,
      top_p,
      max_tokens,
      outputFormat,
      response: result.text
    });

    return res.json(result);

  } catch (err) {
    console.error("Deep prompt error →", err.message);
    return res.status(500).json({
      error: "Server failed processing deep prompt",
      details: err.message
    });
  }
}
