# Twine Playground - Design Doc

## Overview
Browser-based playground for exploring a TypeScript/WASM thermal calculations library. Users write TypeScript code in an editor, execute it in an isolated environment, and see results.

## Architecture

### Technology Choices
- **No framework** - Vanilla TypeScript with direct DOM manipulation
- **Monaco Editor** - Code editing with TypeScript intellisense
- **Web Worker** - Isolated execution environment for user code
- **Vite** - Dev server + build (handles WASM, TS, examples bundling)
- **ES Modules** - Script type="module" for clean separation
- **Chart.js** (future) - Optional visualization

### File Structure
```
playground/
├── index.html              # Main layout, loads modules
├── src/
│   ├── main.ts            # App initialization, wires everything together
│   ├── editor.ts          # Monaco setup, TS config, type definitions
│   ├── output.ts          # Output pane rendering (console, errors, results)
│   ├── runner.ts          # Manages Web Worker, executes user code
│   ├── worker.ts          # Web Worker that loads WASM + runs code
│   └── examples.ts        # Examples loader/manager
├── examples/
│   ├── basic.ts           # Simple calculation example
│   ├── multi-step.ts      # More complex example
│   └── index.ts           # Exports all examples with metadata
├── styles.css             # Layout and theming
├── lib/
│   └── your-thermal-lib/  # Your built WASM + TS wrapper
└── package.json
```

## Component Responsibilities

### index.html
- Basic HTML structure
- CSS Grid layout: header, editor (left), output (right)
- Loads main.ts as module
- Minimal inline styles for critical layout

### main.ts
- Initialize Monaco Editor
- Set up examples dropdown
- Wire "Run" button to runner
- Handle keyboard shortcuts (Cmd/Ctrl+Enter)
- Connect output pane to worker messages

### editor.ts
```typescript
export function initEditor(container: HTMLElement): monaco.editor.IStandaloneCodeEditor
export function setEditorValue(editor: Editor, code: string): void
export function getEditorValue(editor: Editor): string
export function configureTypeScript(libTypes: string): void
```
- Configure Monaco with your library's `.d.ts` types
- Enable TypeScript checking (`@ts-check`)
- Set up editor theme
- Handle compilation from TS to JS

### runner.ts
```typescript
export function executeCode(jsCode: string): Promise<ExecutionResult>
export interface ExecutionResult {
  output: Array<{type: 'log' | 'error' | 'result', content: any}>
  error?: Error
}
```
- Create/manage Web Worker instance
- Send compiled JS to worker
- Listen for messages from worker (console output, results, errors)
- Handle timeouts for infinite loops

### worker.ts
```typescript
// Runs in Web Worker context
self.onmessage = async (e) => {
  const { code } = e.data
  // Load WASM lib
  // Execute user code
  // Post results back
}
```
- Load your WASM + TS wrapper
- Intercept console.log/error to capture output
- Execute user code with try/catch
- Post messages back to main thread

### output.ts
```typescript
export function renderOutput(container: HTMLElement, results: ExecutionResult): void
export function clearOutput(container: HTMLElement): void
```
- Render console logs, errors, results
- Syntax highlighting for objects/errors
- Clear previous output on new run

### examples.ts
```typescript
export interface Example {
  name: string
  description: string
  code: string
}
export function loadExamples(): Example[]
export function populateDropdown(select: HTMLSelectElement, examples: Example[]): void
```
- Import all example files from `examples/` directory
- Build dropdown options
- Handle example selection

## Data Flow

1. **User types code** → Monaco Editor with live TS checking
2. **User clicks "Run" (or Cmd+Enter)** → main.ts
3. **Compile TS to JS** → editor.ts uses Monaco's TS compiler
4. **Send to worker** → runner.ts posts message to worker
5. **Execute in worker** → worker.ts runs code with WASM lib loaded
6. **Stream results back** → worker posts console logs, results, errors
7. **Render output** → output.ts displays in right pane

## Implementation Phases

### Phase 1: Core Functionality
- [ ] Basic HTML layout with split panes
- [ ] Monaco Editor integration
- [ ] Web Worker setup with WASM loading
- [ ] Code execution pipeline
- [ ] Output rendering (console + errors)
- [ ] Examples dropdown

### Phase 2: Polish
- [ ] Keyboard shortcuts
- [ ] Loading states
- [ ] Error highlighting
- [ ] Better styling/theming
- [ ] Performance optimization

### Phase 3: Nice-to-haves
- [ ] Chart.js integration for visualization
- [ ] More examples
- [ ] Responsive layout
- [ ] Dark mode toggle

## Technical Details

### Monaco TypeScript Configuration
```typescript
// In editor.ts
monaco.languages.typescript.typescriptDefaults.setCompilerOptions({
  target: monaco.languages.typescript.ScriptTarget.ES2020,
  allowNonTsExtensions: true,
  moduleResolution: monaco.languages.typescript.ModuleResolutionKind.NodeJs,
  module: monaco.languages.typescript.ModuleKind.ESNext,
  noEmit: true,
  esModuleInterop: true,
  strict: true,
});

// Add your library types
monaco.languages.typescript.typescriptDefaults.addExtraLib(
  yourLibraryDts,
  'file:///node_modules/@your-scope/thermal-lib/index.d.ts'
);
```

### Web Worker Communication
```typescript
// Main thread (runner.ts)
worker.postMessage({ type: 'execute', code: jsCode });

worker.onmessage = (e) => {
  const { type, data } = e.data;
  if (type === 'log') handleLog(data);
  if (type === 'error') handleError(data);
  if (type === 'result') handleResult(data);
};

// Worker (worker.ts)
self.onmessage = async (e) => {
  if (e.data.type === 'execute') {
    // Intercept console
    const originalLog = console.log;
    console.log = (...args) => {
      self.postMessage({ type: 'log', data: args });
    };
    
    try {
      const result = eval(e.data.code);
      self.postMessage({ type: 'result', data: result });
    } catch (err) {
      self.postMessage({ type: 'error', data: err.message });
    }
  }
};
```

### Example Structure
```typescript
// examples/basic.ts
export default {
  name: "Basic Calculation",
  description: "Simple thermal calculation example",
  code: `import { calculate } from '@your-scope/thermal-lib';

const result = calculate({
  temperature: 300,
  pressure: 101325
});

console.log('Result:', result);`
};
```

## Open Questions
- Should we sandbox available globals in worker? (probably yes, restrict DOM access)
- Max execution time before killing worker?
- How to handle async operations in user code?
- Should examples be runnable as-is or require user modification?

## Future Enhancements
- Share code via URL (base64 encoded in hash)
- Export results as JSON/CSV
- Multiple output formats (table view, chart view, raw)
- Auto-run on code change (debounced)
- Split editor for multiple files
