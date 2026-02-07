export async function multiCollectionSearch(collections, queryEmbedding, topK) {
  const allResults = [];

  for (const collection of collections) {
    const res = await collection.query({
      queryEmbeddings: [queryEmbedding],
      nResults: topK
    });

    res.documents[0].forEach((text, i) => {
      allResults.push({
        text,
        distance: res.distances[0][i],
        source: collection.name
      });
    });
  }

  return allResults;
}
