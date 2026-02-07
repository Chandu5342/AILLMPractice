import { getAIResponseAdvanced } from "../../utils/llmClient.js";

export async function rewriteQuery(query) {
  const prompt = `
Rewrite this as a natural search sentence:

"${query}"
`;

  const response = await getAIResponseAdvanced(prompt);
  return response.trim();
}
