export function autoThreshold(results) {
  if (!results.length) return [];

  const avg =
    results.reduce((sum, r) => sum + r.distance, 0) / results.length;

  const threshold = avg * 1.25;

  return results.filter(r => r.distance <= threshold);
}
