import { generateEmbedding } from "../utils/embeddingsClients.js";
import { getCollection } from "../db/chromaClient.js";

export async function compareService(query) {

    const queryEmbedding = await generateEmbedding(query);

    const sizeCollection = await getCollection("os_size_chunks");
    const topicCollection = await getCollection("os_topic_chunks");
    const hybridCollection = await getCollection("os_hybrid_chunks");

    const sizeResult = await sizeCollection.query({
        queryEmbeddings: [queryEmbedding],
        nResults: 3
    });

    const topicResult = await topicCollection.query({
        queryEmbeddings: [queryEmbedding],
        nResults: 3
    });

    const hybridResult = await hybridCollection.query({
        queryEmbeddings: [queryEmbedding],
        nResults: 3
    });

    return {
        query,
        size: sizeResult,
        topic: topicResult,
        hybrid: hybridResult
    };
}
