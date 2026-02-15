export function generateChunkIds(base, count) {
    const timestamp = Date.now();
    return Array.from({ length: count }, (_, i) =>
        `${base}-${timestamp}-${i}`
    );
}
