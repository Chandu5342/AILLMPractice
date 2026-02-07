export function keywordFilter(results, query) {
  const words = query.toLowerCase().split(/\s+/);

  return results.filter(r =>
    words.some(w => r.text.toLowerCase().includes(w))
  );
}
