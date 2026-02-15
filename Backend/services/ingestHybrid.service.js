import { cleanText } from "../utils/preprocessing/textCleaner.js";
import { hybridChunker } from "../utils/chunkers/hybridChunker.js";
import { generateChunkIds } from "../utils/idGenerator.js";
import { generateEmbedding } from "../utils/embeddingsClients.js";
import { getCollection } from "../db/chromaClient.js";
import { startTimer, endTimer, getMemoryUsage } from "../utils/performanceLogger.js";

export async function ingestHybridService(text, preprocessingOptions = {}, debug = false) {

    const overallStart = startTimer();

    // ---------------- PREPROCESSING ----------------
    const preprocessStart = startTimer();
    const cleanedText = cleanText(text, preprocessingOptions);
    const preprocessTime = endTimer(preprocessStart);

    // ---------------- CHUNKING ----------------
    const chunkStart = startTimer();
    const chunksData = hybridChunker(cleanedText, 800, 100);
    const chunkTime = endTimer(chunkStart);

    const ids = generateChunkIds("hybrid", chunksData.length);

    // ---------------- EMBEDDING (PARALLEL) ----------------
    const embedStart = startTimer();

    const embeddings = await Promise.all(
        chunksData.map(chunk => generateEmbedding(chunk.content))
    );

    const embedTime = endTimer(embedStart);

    // ---------------- STORE ----------------
    const storeStart = startTimer();
    const collection = await getCollection("os_hybrid_chunks");

    await collection.add({
        ids,
        documents: chunksData.map(c => c.content),
        embeddings,
        metadatas: chunksData.map((c, i) => ({
            strategy: "hybrid",
            paragraphNumber: c.paragraphNumber,
            subChunk: c.subChunk,
            chunkIndex: i,
            totalChunks: chunksData.length
        }))
    });

    const storeTime = endTimer(storeStart);
    const overallTime = endTimer(overallStart);

    if (!debug) {
        return {
            message: "Hybrid ingestion complete",
            totalChunks: chunksData.length
        };
    }

    return {
        preprocessingPhase: {
            cleanedText,
            timeMs: preprocessTime
        },
        chunkingPhase: {
            totalChunks: chunksData.length,
            chunks: chunksData,
            timeMs: chunkTime
        },
        embeddingPhase: {
            embeddings: embeddings.map((emb, i) => ({
                id: ids[i],
                paragraphNumber: chunksData[i].paragraphNumber,
                subChunk: chunksData[i].subChunk,
                dimension: emb.length,
                sample: emb.slice(0, 5)
            })),
            timeMs: embedTime
        },
        storagePhase: {
            collection: "os_hybrid_chunks",
            ids,
            timeMs: storeTime
        },
        performance: {
            totalTimeMs: overallTime,
            memoryUsage: getMemoryUsage()
        }
    };
}
