// utils/aiClientsAdvanced.js
import dotenv from "dotenv";
dotenv.config();

import { OpenAI } from "openai";
import { GoogleGenerativeAI } from "@google/generative-ai";
import Groq from "groq-sdk";

// -------------------------------------------------
// CLIENT INITIALIZATION (SAME AS DAY-2)
// -------------------------------------------------

let openai = null;
let gemini = null;
let groq = null;

const provider = process.env.AI_PROVIDER?.trim().toLowerCase();

// ------ OPENAI ------
if (provider === "openai") {
  if (!process.env.OPENAI_API_KEY) throw new Error("Missing OPENAI_API_KEY");
  openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  console.log("✅ OpenAI client initialized (Day-3 Advanced)");
}

// ------ GEMINI ------
if (provider === "gemini") {
  if (!process.env.GEMINI_API_KEY) throw new Error("Missing GEMINI_API_KEY");
  gemini = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  console.log("✅ Gemini client initialized (Day-3 Advanced)");
}

// ------ GROQ ------
if (provider === "groq") {
  if (!process.env.GROQ_API_KEY) throw new Error("Missing GROQ_API_KEY");
  groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
  console.log("✅ Groq client initialized (Day-3 Advanced)");
}

// -------------------------------------------------
// OPENAI — MULTI-MESSAGE CHAT
// -------------------------------------------------
export async function getOpenAIResponseAdvanced(messages) {
  if (!openai) throw new Error("OpenAI client not initialized");

  const resp = await openai.chat.completions.create({
    model: process.env.AI_MODEL_OPENAI || "gpt-4o-mini",
    messages,        // <-- multi-message array
    temperature: 0.7 // better quality responses
  });

  return {
    provider: "openai",
    text: resp.choices[0].message.content
  };
}

// -------------------------------------------------
// GEMINI — MULTI-MESSAGE CHAT
// -------------------------------------------------
export async function getGeminiResponseAdvanced(messages) {
  if (!gemini) throw new Error("Gemini client not initialized");

  // Gemini needs parts[]
  const formattedMsgs = messages.map(m => ({
    role: m.role,
    parts: [{ text: m.content }]
  }));

  const model = gemini.getGenerativeModel({
    model: "gemini-1.5-flash"
  });

  const result = await model.generateContent(formattedMsgs);

  return {
    provider: "gemini",
    text: result.response.text()
  };
}

// -------------------------------------------------
// GROQ — MULTI-MESSAGE CHAT
// -------------------------------------------------
export async function getGroqResponseAdvanced(messages) {
  if (!groq) throw new Error("Groq client not initialized");

  const chat = await groq.chat.completions.create({
    model: process.env.AI_MODEL_GROQ || "llama-3.1-8b-instant",
    messages
  });

  return {
    provider: "groq",
    text: chat.choices[0].message.content
  };
}

// -------------------------------------------------
// MAIN AUTO SELECTOR (SAME STYLE AS DAY-2)
// -------------------------------------------------
export async function getAIResponseAdvanced(messages) {
  switch (provider) {
    case "openai":
      return getOpenAIResponseAdvanced(messages);

    case "gemini":
      return getGeminiResponseAdvanced(messages);

    case "groq":
      return getGroqResponseAdvanced(messages);

    default:
      throw new Error("Unknown AI_PROVIDER");
  }
}
