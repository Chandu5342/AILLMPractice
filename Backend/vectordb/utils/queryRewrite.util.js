import { getAIResponseAdvanced } from "../../utils/aiClientsAdvanced.js";

export async function rewriteQuery(query) {
  const messages = [
    {
      role: "system",
      content:
        "Rewrite the query into ONE short natural sentence for semantic search. Do NOT explain. Do NOT list options."
    },
    {
      role: "user",
      content: query
    }
  ];

  const aiResult = await getAIResponseAdvanced(messages);

  // safety: trim + first line only
  return aiResult.text.split("\n")[0].trim();
}

