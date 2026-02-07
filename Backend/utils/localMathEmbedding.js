/**
 * VERY SIMPLE local embedding (learning purpose only)
 * Converts text → numerical vector
 */
export function generateLocalMathEmbedding(text, dimension = 128) {
  const vector = new Array(dimension).fill(0);

  for (let i = 0; i < text.length; i++) {
    const code = text.charCodeAt(i);
    vector[i % dimension] += code / 255;
  }

  return normalize(vector);
}

function normalize(vector) {
  const magnitude = Math.sqrt(
    vector.reduce((sum, val) => sum + val * val, 0)
  );
  return vector.map(v => v / magnitude);
}
