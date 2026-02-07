export function metadataFilter(results, metadata) {
  if (!metadata) return results;

  return results.filter(r => {
    if (metadata.author && r.author !== metadata.author) return false;
    if (metadata.tag && !r.tags?.includes(metadata.tag)) return false;
    return true;
  });
}
