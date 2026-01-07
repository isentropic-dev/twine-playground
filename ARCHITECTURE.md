# Architecture

## High-Level Overview

Twine Playground is a browser-based code playground for exploring Twine's TypeScript interface.
Users write TypeScript code in Monaco Editor,
execute it in an isolated Web Worker,
and see results in an output pane.

The architecture follows a simple pattern:
a main thread manages the UI and editor,
while a Web Worker provides isolated code execution.
Deno serves as the development server,
transpiling TypeScript to JavaScript on the fly.

## Code Map

### Entry Points

- `server.ts` - Deno HTTP server that serves static files and transpiles TypeScript
- `index.html` - Main HTML page, loads Monaco Editor from CDN and bootstraps the app
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
- Executes user code via `eval()`
- Posts results back to main thread

**Output (`src/output.ts`)**
- Renders execution results in the output pane
- Formats console logs, errors, and return values
- Handles JSON serialization for objects
- Key type: `OutputMessage`

### Infrastructure

**Server (`server.ts`)**
- HTTP server using Deno.serve
- Transpiles .ts files to JavaScript using `@deno/emit` bundler
- Serves static files (HTML, CSS) with correct MIME types
- Runs on port 8000

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
loaded via CDN.

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

**Deno-Native Serving**
Server code runs on Deno, leveraging native TypeScript support.
Browser code is transpiled via `@deno/emit` before serving.

## Future Extension Points

**External Library Integration**
The worker can import and expose external TypeScript libraries (i.e. twine-ts).
Library types can be added via `monaco.languages.typescript.typescriptDefaults.addExtraLib()`.

**Examples System**
When added, should use `src/examples.ts` to load and populate dropdown with example snippets.

**Visualization**
Output pane can be extended to render charts (Chart.js) or other visualizations beyond text output.
