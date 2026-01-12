console.log = (...args: unknown[]) => {
  self.postMessage({ type: "log", data: args.join(" ") });
};

console.error = (...args: unknown[]) => {
  self.postMessage({ type: "error", data: args.join(" ") });
};

self.onmessage = async (e) => {
  if (e.data.type !== "execute") {
    return;
  }

  const { code } = e.data;

  try {
    const blob = new Blob([code], { type: "application/javascript" });
    const url = URL.createObjectURL(blob);

    try {
      /* @vite-ignore */
      await import(url);
      self.postMessage({ type: "result", data: undefined });
    } finally {
      URL.revokeObjectURL(url);
    }
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    self.postMessage({ type: "error", data: message });
  }
};
