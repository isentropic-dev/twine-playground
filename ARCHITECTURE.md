# Architecture

## High-Level Overview

Twine Playground is a browser-based code playground for exploring Twine's TypeScript interface.
Users write TypeScript code in Monaco Editor,
execute it in an isolated Web Worker,
and see results in an output pane.

The architecture follows a simple pattern:
a main thread manages the UI and editor,
while a Web Worker provides isolated code execution.
Vite serves as the development server and build tool,
bundling Monaco Editor and handling TypeScript compilation.

## Code Map

### Entry Points

- `vite.config.ts` - Vite configuration with Deno and Monaco Editor plugins
- `index.html` - Main HTML page, loads Monaco Editor and bootstraps the app
- `src/main.ts` - Application entry point, wires together editor, runner, and output

### Core Modules

**Editor (`src/editor.ts`)**
- Initializes Monaco Editor with TypeScript support
- Configures TypeScript compiler options (strict mode, ES2020 target)
- Compiles TypeScript to JavaScript using Monaco's built-in compiler
- Key type: `Editor` (alias for Monaco's IStandaloneCodeEditor)

**Runner (`src/runner.ts`)**
- Manages Web Worker lifecycle (creates, terminates, handles timeouts)
- Sends compiled JavaScript to worker for execution
- Receives messages from worker (logs, errors, results)
- Enforces 5-second execution timeout
- Key type: `ExecutionResult`

**Worker (`src/worker.ts`)**
- Runs in isolated Web Worker context
- Intercepts console.log/error to capture output
- Executes user code via dynamic `import()` with Blob URLs
- Posts results back to main thread

**Output (`src/output.ts`)**
- Renders execution results in the output pane
- Formats console logs, errors, and return values
- Handles JSON serialization for objects
- Key type: `OutputMessage`

### Infrastructure

**Vite (`vite.config.ts`)**
- Development server with HMR support
- Bundles Monaco Editor assets via `vite-plugin-monaco-editor`
- Integrates Deno with `@deno/vite-plugin`
- Runs on port 5173 by default

**Styles (`styles.css`)**
- CSS Grid layout for split-pane interface
- Monaco theme colors for output pane consistency

## Cross-Cutting Concerns

### TypeScript Compilation Flow
1. User types TypeScript in Monaco Editor
2. Monaco provides real-time type checking and IntelliSense
3. On "Run", `getCompiledCode()` uses Monaco's TypeScript worker to emit JavaScript
4. Compiled JavaScript is sent to Web Worker for execution

### Message Passing
All communication between main thread and worker uses `postMessage`:
- Main → Worker: `{ type: 'execute', code: string }`
- Worker → Main: `{ type: 'log' | 'error' | 'result', data: unknown }`

### Error Handling
Errors are caught at multiple levels:
- Monaco catches TypeScript compilation errors (shown as red squiggles)
- Runner catches worker creation/timeout errors
- Worker catches runtime execution errors via try/catch
- All errors flow through the output rendering system

## Key Invariants

**No Framework Dependencies**
The project uses vanilla TypeScript with direct DOM manipulation.
Monaco Editor is the only external dependency,
bundled via npm and Vite.

**TypeScript-First**
Users write TypeScript exclusively.
The editor enforces TypeScript syntax and provides type checking.
JavaScript is only generated at execution time.

**Isolated Execution**
User code always runs in a Web Worker,
never in the main thread.
Workers are terminated after execution or timeout to prevent resource leaks.

**Single Active Worker**
Only one worker exists at a time.
Starting a new execution terminates any existing worker.

## Deployment

**Build Strategy (Not Yet Implemented)**
For production deployment to CDN (S3 + CloudFront),
the project will use Vite's build command (`vite build`).
Vite will bundle all assets, optimize Monaco Editor,
and generate production-ready files in a `dist/` folder with automatic cache-busting.

## Future Extension Points

**External Library Integration**
The worker can import and expose external TypeScript libraries (i.e. twine-ts).
Library types can be added via `monaco.languages.typescript.typescriptDefaults.addExtraLib()`.

**Examples System**
When added, should use `src/examples.ts` to load and populate dropdown with example snippets.

**Visualization**
Output pane can be extended to render charts (Chart.js) or other visualizations beyond text output.
