import { cleanText } from "../utils/preprocessing/textCleaner.js";
import { sizeChunker } from "../utils/chunkers/sizeChunker.js";
import { generateChunkIds } from "../utils/idGenerator.js";
import { generateEmbedding } from "../utils/embeddingsClients.js";
import { getCollection } from "../db/chromaClient.js";
import { startTimer, endTimer, getMemoryUsage } from "../utils/performanceLogger.js";

export async function ingestSizeService(text, preprocessingOptions = {}, debug = false) {

    const overallStart = startTimer();

    // ---------------- PREPROCESSING ----------------
    const preprocessStart = startTimer();
    const cleanedText = cleanText(text, preprocessingOptions);
    const preprocessTime = endTimer(preprocessStart);

    // ---------------- CHUNKING ----------------
    const chunkStart = startTimer();
    const chunksData = sizeChunker(cleanedText, 500); // fixed size 500 chars
    const chunkTime = endTimer(chunkStart);

    const ids = generateChunkIds("size", chunksData.length);

    // ---------------- EMBEDDING (PARALLEL) ----------------
    const embedStart = startTimer();

    const embeddings = await Promise.all(
        chunksData.map(chunk => generateEmbedding(chunk.content))
    );

    const embedTime = endTimer(embedStart);

    // ---------------- STORAGE ----------------
    const storeStart = startTimer();

    const collection = await getCollection("os_size_chunks");

    await collection.add({
        ids,
        documents: chunksData.map(c => c.content),
        embeddings,
        metadatas: chunksData.map((c, i) => ({
            strategy: "size",
            paragraphNumber: c.paragraphNumber || null,
            subChunk: c.subChunk || null,
            chunkIndex: i,
            totalChunks: chunksData.length
        }))
    });

    const storeTime = endTimer(storeStart);
    const overallTime = endTimer(overallStart);

    // ---------------- RESPONSE ----------------

    if (!debug) {
        return {
            message: "Size-based ingestion complete",
            totalChunks: chunksData.length
        };
    }

    return {
        strategy: "size",

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
                paragraphNumber: chunksData[i].paragraphNumber || null,
                subChunk: chunksData[i].subChunk || null,
                dimension: emb.length,
                sample: emb.slice(0, 5) // show first 5 values only
            })),
            timeMs: embedTime
        },

        storagePhase: {
            collection: "os_size_chunks",
            ids,
            timeMs: storeTime
        },

        performance: {
            totalTimeMs: overallTime,
            memoryUsage: getMemoryUsage()
        }
    };
}
