import dotenv from "dotenv";
dotenv.config();

import { OpenAI } from "openai";
import { GoogleGenerativeAI } from "@google/generative-ai";
import Groq from "groq-sdk";

let openai = null;
let gemini = null;
let groq = null;

const provider = process.env.AI_PROVIDER?.trim().toLowerCase();

// ------------------------- Clients -------------------------
if (provider === "openai") {
  if (!process.env.OPENAI_API_KEY) throw new Error("Missing OPENAI_API_KEY");
  openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
}

if (provider === "gemini") {
  if (!process.env.GEMINI_API_KEY) throw new Error("Missing GEMINI_API_KEY");
  gemini = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
}

if (provider === "groq") {
  if (!process.env.GROQ_API_KEY) throw new Error("Missing GROQ_API_KEY");
  groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
}

// ------------------------- Helpers -------------------------

// OpenAI
async function getOpenAIResponseDeep(messages, options) {
  if (!openai) throw new Error("OpenAI client not initialized");

  const resp = await openai.chat.completions.create({
    model: process.env.AI_MODEL_OPENAI || "gpt-4o-mini",
    messages,
    temperature: options.temperature,
    top_p: options.top_p,
    max_tokens: options.max_tokens
  });

  let text = resp.choices[0]?.message?.content ?? "No response";

  if (options.outputFormat === 'json') {
    try { text = JSON.parse(text); } catch {}
  }

  return { provider: "openai", text };
}

// Gemini
async function getGeminiResponseDeep(messages, options) {
  if (!gemini) throw new Error("Gemini client not initialized");

  const formattedMsgs = messages.map(m => ({
    role: m.role,
    parts: [{ text: m.content }]
  }));

  const model = gemini.getGenerativeModel({ model: "gemini-1.5-flash" });
  const result = await model.generateContent(formattedMsgs);

  let text = result.response.text();
  if (options.outputFormat === 'json') {
    try { text = JSON.parse(text); } catch {}
  }

  return { provider: "gemini", text };
}

// Groq
async function getGroqResponseDeep(messages, options) {
  if (!groq) throw new Error("Groq client not initialized");

  const chat = await groq.chat.completions.create({
    model: process.env.AI_MODEL_GROQ || "llama-3.1-8b-instant",
    messages
  });

  let text = chat.choices[0].message.content;
  if (options.outputFormat === 'json') {
    try { text = JSON.parse(text); } catch {}
  }

  return { provider: "groq", text };
}

// ------------------------- Main Selector -------------------------
export async function getAIResponseDeep(messages, options = {}) {
  switch (provider) {
    case "openai": return getOpenAIResponseDeep(messages, options);
    case "gemini": return getGeminiResponseDeep(messages, options);
    case "groq": return getGroqResponseDeep(messages, options);
    default: throw new Error("Unknown AI_PROVIDER");
  }
}
