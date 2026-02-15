import { ChromaClient } from "chromadb";

const client = new ChromaClient();

export async function getCollection(name) {

    try {
        return await client.getCollection({ name });
    } catch {
        return await client.createCollection({ name });
    }
}
