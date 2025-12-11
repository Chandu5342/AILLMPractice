import dotenv from "dotenv";
dotenv.config();

import { OpenAI } from "openai";
import { GoogleGenerativeAI } from "@google/generative-ai";
import Groq from "groq-sdk";

// ----------------------------------------------
// CLIENT INITIALIZATION
// ----------------------------------------------

let openai = null;
let gemini = null;
let groq = null;

const provider = process.env.AI_PROVIDER?.trim().toLowerCase();

// ---------- OpenAI Client ----------
if (provider === "openai") {
  if (!process.env.OPENAI_API_KEY) throw new Error("Missing OPENAI_API_KEY");
  openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  console.log("✅ OpenAI client initialized");
}

// ---------- Gemini Client ----------
if (provider === "gemini") {
  if (!process.env.GEMINI_API_KEY) throw new Error("Missing GEMINI_API_KEY");
  gemini = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  console.log("✅ Gemini client initialized");
}

// ---------- Groq Client ----------
if (provider === "groq") {
  if (!process.env.GROQ_API_KEY) throw new Error("Missing GROQ_API_KEY");
  groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
  console.log("✅ Groq client initialized");
}

// ----------------------------------------------
// OPENAI HELPER
// ----------------------------------------------

export async function getOpenAIResponse(prompt) {
  if (!openai) throw new Error("OpenAI client not initialized");

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 15000);

    const resp = await openai.chat.completions.create(
      {
        model: process.env.AI_MODEL_OPENAI || "gpt-4o-mini",
        messages: [
          { role: "system", content: "You are a helpful assistant." },
          { role: "user", content: prompt },
        ],
      },
      { signal: controller.signal }
    );

    clearTimeout(timeout);

    return {
      provider: "openai",
      text:
        resp?.choices?.[0]?.message?.content ??
        resp?.choices?.[0]?.text ??
        "No response",
    };
  } catch (err) {
    if (err.name === "AbortError") throw new Error("OpenAI request timed out (504)");
    throw err;
  }
}

// ----------------------------------------------
// GEMINI HELPER
// ----------------------------------------------

const GEMINI_PRIMARY = "gemini-1.5-pro";
const GEMINI_FALLBACK = "gemini-1.5-flash";

export async function getGeminiResponse(prompt) {
  if (!gemini) throw new Error("Gemini client not initialized");

  async function call(modelName) {
    const model = gemini.getGenerativeModel({ model: modelName });
    const result = await model.generateContent(prompt);
    return result.response.text();
  }

  try {
    const text = await call(GEMINI_PRIMARY);
    return { provider: "gemini", text };
  } catch (err) {
    console.error("❌ Gemini Error:", err.message);

    if (err.message.includes("429")) {
      throw new Error("Gemini quota exceeded. Wait for reset or enable billing.");
    }

    if (err.message.includes("404")) {
      console.log(`⚠ Switching to fallback model: ${GEMINI_FALLBACK}`);
      const text = await call(GEMINI_FALLBACK);
      return { provider: "gemini", text, fallback: true };
    }

    throw err;
  }
}

// ----------------------------------------------
// GROQ HELPER
// ----------------------------------------------

export async function getGroqResponse(prompt) {
  if (!groq) throw new Error("Groq client not initialized");

  const chat = await groq.chat.completions.create({
    model: process.env.AI_MODEL_GROQ || "llama-3.1-70b-versatile",
    messages: [{ role: "user", content: prompt }],
  });

  return {
    provider: "groq",
    text: chat.choices[0].message.content,
  };
}

// ----------------------------------------------
// MAIN HELPER (AUTO SELECT)
// ----------------------------------------------

export async function getAIResponse(prompt) {
  switch (provider) {
    case "openai":
      return getOpenAIResponse(prompt);
    case "gemini":
      return getGeminiResponse(prompt);
    case "groq":
      return getGroqResponse(prompt);
    default:
      throw new Error("Unknown AI_PROVIDER");
  }
}
