import type { OutputMessage } from './output.ts';
import WorkerUrl from './worker.ts?worker&url';

export interface ExecutionResult {
  messages: OutputMessage[];
  error?: string;
}

let worker: Worker | null = null;

export function executeCode(code: string): Promise<ExecutionResult> {
  return new Promise((resolve) => {
    const messages: OutputMessage[] = [];

    if (worker) {
      worker.terminate();
    }

    worker = new Worker(WorkerUrl, { type: 'module' });

    worker.onmessage = (e) => {
      const { type, data } = e.data;

      if (type === 'log') {
        messages.push({ type: 'log', content: data });
      } else if (type === 'error') {
        messages.push({ type: 'error', content: data });
        resolve({ messages });
      } else if (type === 'result') {
        if (data !== undefined) {
          messages.push({ type: 'result', content: data });
        }
        resolve({ messages });
      }
    };

    worker.onerror = (e) => {
      messages.push({ type: 'error', content: e.message });
      resolve({ messages, error: e.message });
    };

    worker.postMessage({ type: 'execute', code });

    setTimeout(() => {
      if (worker) {
        worker.terminate();
        worker = null;
        messages.push({ type: 'error', content: 'Execution timeout (5s)' });
        resolve({ messages, error: 'Timeout' });
      }
    }, 5000);
  });
}
