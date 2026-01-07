self.onmessage = async (e) => {
  if (e.data.type !== 'execute') {
    return;
  }

  const { code } = e.data;

  const originalLog = console.log;
  const originalError = console.error;

  console.log = (...args: unknown[]) => {
    self.postMessage({ type: 'log', data: args.join(' ') });
  };

  console.error = (...args: unknown[]) => {
    self.postMessage({ type: 'error', data: args.join(' ') });
  };

  try {
    const result = eval(code);
    self.postMessage({ type: 'result', data: result });
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    self.postMessage({ type: 'error', data: message });
  } finally {
    console.log = originalLog;
    console.error = originalError;
  }
};
