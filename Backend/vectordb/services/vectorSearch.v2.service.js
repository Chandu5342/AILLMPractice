import { getChromaCollection } from "../chromaCollection.js";
import { generateEmbedding } from "./embedding.service.js";

import { rewriteQuery } from "../utils/queryRewrite.util.js";
import { autoThreshold } from "../filters/autoThreshold.filter.js";
import { keywordFilter } from "../filters/keyword.filter.js";
import { metadataFilter } from "../filters/metadata.filter.js";
import { rerank } from "../filters/rerank.filter.js";

export async function advancedSearchPipeline({
  query,
  topK,
  useRewrite,
  metadata
}) {
  const collection = await getChromaCollection();

  const trace = {
    inputQuery: query
  };

  /* 1️⃣ Query Rewrite */
  const rewrittenQuery = useRewrite ? await rewriteQuery(query) : query;
  trace.rewrittenQuery = rewrittenQuery;

  /* 2️⃣ Embedding */
  const queryEmbedding = await generateEmbedding(rewrittenQuery);
  trace.embeddingSize = queryEmbedding.length;

  /* 3️⃣ Vector Search */
  const raw = await collection.query({
    queryEmbeddings: [queryEmbedding],
    nResults: topK
  });

  let results = raw.documents[0].map((text, i) => ({
    text,
    distance: raw.distances[0][i],
    similarity: 1 / (1 + raw.distances[0][i])
  }));

  trace.afterVectorSearch = [...results];

  /* 4️⃣ Auto Threshold */
  results = autoThreshold(results);
  trace.afterAutoThreshold = [...results];

  /* 5️⃣ Keyword Filter */
  results = keywordFilter(results, rewrittenQuery);
  trace.afterKeywordFilter = [...results];

  /* 6️⃣ Metadata Filter */
  results = metadataFilter(results, metadata);
  trace.afterMetadataFilter = [...results];

  /* 7️⃣ Re-rank */
  results = rerank(results);
  trace.afterRerank = [...results];

  trace.finalResults = results;

  return trace;
}
