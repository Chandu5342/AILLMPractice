export function hybridChunker(text, maxSize = 800, overlap = 100) {

    const paragraphs = text.split(/\n{2,}/);
    const chunks = [];

    paragraphs.forEach((para, paraIndex) => {

        const trimmedPara = para.trim();
        if (!trimmedPara) return;

        if (trimmedPara.length <= maxSize) {

            chunks.push({
                content: trimmedPara,
                paragraphNumber: paraIndex + 1,
                subChunk: 1
            });

        } else {

            let start = 0;
            let subChunkIndex = 1;

            while (start < trimmedPara.length) {

                const slice = trimmedPara.slice(start, start + maxSize);

                chunks.push({
                    content: slice,
                    paragraphNumber: paraIndex + 1,
                    subChunk: subChunkIndex
                });

                start += maxSize - overlap;
                subChunkIndex++;
            }
        }
    });

    return chunks;
}
