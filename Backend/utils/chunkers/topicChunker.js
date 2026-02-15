export function topicChunker(text) {

    const paragraphs = text.split(/\n{2,}/);

    return paragraphs
        .map((para, index) => ({
            content: para.trim(),
            paragraphNumber: index + 1,
            subChunk: 1
        }))
        .filter(chunk => chunk.content.length > 0);
}
