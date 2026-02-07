import { sql } from "./sqlClient.js";

export async function insertEmbedding(text, embedding) {
  await sql.query(
    "INSERT INTO embeddings (text, vector) VALUES (?, ?)",
    [text, JSON.stringify(embedding)]
  );
}

export async function getAllEmbeddings() {
  const [rows] = await sql.query("SELECT text, vector FROM embeddings");
  return rows.map(r => ({
    text: r.text,
    vector: JSON.parse(r.vector)
  }));
}
