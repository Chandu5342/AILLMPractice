export function startTimer() {
    return process.hrtime.bigint();
}

export function endTimer(startTime) {
    const end = process.hrtime.bigint();
    return Number(end - startTime) / 1_000_000; // ms
}

export function getMemoryUsage() {
    const memory = process.memoryUsage();
    return {
        rssMB: (memory.rss / 1024 / 1024).toFixed(2),
        heapUsedMB: (memory.heapUsed / 1024 / 1024).toFixed(2),
        heapTotalMB: (memory.heapTotal / 1024 / 1024).toFixed(2)
    };
}
