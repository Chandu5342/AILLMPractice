import OpenAI from "openai";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { pipeline } from "@xenova/transformers";
import { generateLocalMathEmbedding } from "./localMathEmbedding.js";

let localMLModel = null;

// ---------- LOCAL ML (SEMANTIC) ----------
async function getLocalMLEmbedding(text) {
  if (!localMLModel) {
    localMLModel = await pipeline(
      "feature-extraction",
      "Xenova/all-MiniLM-L6-v2"
    );
  }

  const output = await localMLModel(text, {
    pooling: "mean",
    normalize: true
  });

  return Array.from(output.data);
}

// ---------- OPENAI ----------
async function getOpenAIEmbedding(text) {
  const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

  const res = await openai.embeddings.create({
    model: "text-embedding-3-small",
    input: text
  });

  return res.data[0].embedding;
}

// ---------- GEMINI ----------
async function getGeminiEmbedding(text) {
  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  const model = genAI.getGenerativeModel({ model: "embedding-001" });

  const result = await model.embedContent(text);
  return result.embedding.values;
}

// ---------- MAIN SWITCH ----------
export async function generateEmbedding(text) {
  const provider = process.env.AI_PROVIDER;

  if (!text) throw new Error("Text is required");

  switch (provider) {
    case "local-math":
      return generateLocalMathEmbedding(text);

    case "local-ml":
      return await getLocalMLEmbedding(text);

    case "openai":
      return await getOpenAIEmbedding(text);

    case "gemini":
      return await getGeminiEmbedding(text);

    default:
      throw new Error("Invalid AI_PROVIDER");
  }
}
