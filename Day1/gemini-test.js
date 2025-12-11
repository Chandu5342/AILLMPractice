import dotenv from "dotenv";
import { GoogleGenerativeAI } from "@google/generative-ai";

dotenv.config();

async function runTest() {
  try {
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

    // Use Gemini 2.5 Pro
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-pro" });

    const result = await model.generateContent({
      contents: [
        {
          role: "user",
          parts: [{ text: "Hello Gemini! Explain AI in a few simple words." }]
        }
      ]
    });

    console.log("\n✅ Gemini 2.5 response:");
    console.log(result.response.text());
  } catch (err) {
    console.error("\n❌ Gemini API error:");
    console.error(err);
  }
}

runTest();
