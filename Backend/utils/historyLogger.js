// utils/historyLogger.js
import fs from "fs";
import path from "path";

const logFile = path.join(process.cwd(), "logs", "ai-history.json");

export function logAIHistory(entry) {
  try {
    let data = [];

    if (fs.existsSync(logFile)) {
      data = JSON.parse(fs.readFileSync(logFile, "utf8"));
    }

    data.push({
      timestamp: new Date().toISOString(),
      ...entry,
    });

    fs.writeFileSync(logFile, JSON.stringify(data, null, 2));
  } catch (err) {
    console.error("Failed to write AI history log:", err.message);
  }
}
