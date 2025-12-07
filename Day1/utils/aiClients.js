import dotenv from "dotenv";
dotenv.config();

import { OpenAI } from "openai";
import { GoogleGenerativeAI } from "@google/generative-ai";

let openai = null;
let genAI = null;

// ----------------- OpenAI Setup -----------------
if (process.env.AI_PROVIDER === "openai") {
  if (!process.env.OPENAI_API_KEY) throw new Error("Missing OPENAI_API_KEY");
  openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
}

// ----------------- Gemini Setup (v1 endpoint) -----------------
if (process.env.AI_PROVIDER === "gemini") {
  if (!process.env.GEMINI_API_KEY) throw new Error("Missing GEMINI_API_KEY");

  genAI = new GoogleGenerativeAI({
    apiKey: process.env.GEMINI_API_KEY,
    apiEndpoint: "https://generativelanguage.googleapis.com/v1" // force v1
  });
}

// ----------------- OpenAI Helper -----------------
async function getOpenAIResponse(prompt) {
  if (!openai) throw new Error("OpenAI client not initialized");

  try {
    const controller = new AbortController();
    const timeoutMs = 15000;
    const id = setTimeout(() => controller.abort(), timeoutMs);

    const resp = await openai.chat.completions.create(
      {
        model: process.env.AI_MODEL_OPENAI || "gpt-4o",
        messages: [
          { role: "system", content: "You are a helpful assistant." },
          { role: "user", content: prompt }
        ]
      },
      { signal: controller.signal }
    );

    clearTimeout(id);

    const text = resp?.choices?.[0]?.message?.content ?? resp?.choices?.[0]?.text ?? String(resp);
    return { text, raw: resp };
  } catch (err) {
    if (err.name === "AbortError") {
      const timeoutErr = new Error("OpenAI request timed out");
      timeoutErr.statusCode = 504;
      throw timeoutErr;
    }
    throw err;
  }
}

// ----------------- Gemini Helper (v1, string prompt) -----------------
async function getGeminiResponse(prompt) {
  if (!genAI) throw new Error("Gemini client not initialized");

  try {
    const model = genAI.getGenerativeModel({ model: "models/text-bison-001" });

    // pass prompt as string (v1 endpoint)
    const result = await model.generateContent(prompt);

    const text = result.response.text();
    return { text, raw: result };
  } catch (err) {
    if (err.status === 429) {
      const rateErr = new Error("Gemini rate limit (429)");
      rateErr.statusCode = 429;
      throw rateErr;
    }
    throw err;
  }
}

// ----------------- Export -----------------
export { getOpenAIResponse, getGeminiResponse };
