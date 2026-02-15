export function sizeChunker(text, chunkSize = 500) {

    const chunks = [];
    let start = 0;
    let paragraphNumber = 1;

    while (start < text.length) {

        const slice = text.slice(start, start + chunkSize);

        chunks.push({
            content: slice,
            paragraphNumber,
            subChunk: 1
        });

        start += chunkSize;
        paragraphNumber++;
    }

    return chunks;
}
