export interface OutputMessage {
  type: 'log' | 'error' | 'result';
  content: unknown;
}

export function clearOutput(container: HTMLElement): void {
  container.innerHTML = '';
}

export function renderOutput(container: HTMLElement, messages: OutputMessage[]): void {
  clearOutput(container);

  for (const message of messages) {
    const line = document.createElement('div');
    line.className = `output-line ${message.type}`;
    line.textContent = formatContent(message.content);
    container.appendChild(line);
  }
}

function formatContent(content: unknown): string {
  if (content === undefined) {
    return 'undefined';
  }
  if (content === null) {
    return 'null';
  }
  if (typeof content === 'string') {
    return content;
  }
  if (typeof content === 'object') {
    try {
      return JSON.stringify(content, null, 2);
    } catch {
      return String(content);
    }
  }
  return String(content);
}
