import { useState } from "react";

export interface MessageEventHandler {
    (event: MessageEvent): void;
}

export function useWorker(messageEventHandler: MessageEventHandler): Worker {
    // Create new worker once and never again
    const [worker] = useState(() => createWorker(messageEventHandler));
    return worker;
}

function createWorker(messageEventHandler: MessageEventHandler): Worker {
    const workerUrl = new URL("../../public/workers/whisperWorker.js", import.meta.url);
    const worker = new Worker(workerUrl, {
        type: "module",
        name: "whisper-worker"
    });
    
    // Listen for messages from the Web Worker
    worker.addEventListener("message", messageEventHandler);
    return worker;
}
