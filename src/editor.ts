declare const monaco: typeof import('monaco-editor');

export type Editor = monaco.editor.IStandaloneCodeEditor;

export function initEditor(container: HTMLElement): Promise<Editor> {
  return new Promise((resolve) => {
    // @ts-ignore - Monaco loader is loaded via CDN
    require.config({ paths: { vs: 'https://cdn.jsdelivr.net/npm/monaco-editor@0.45.0/min/vs' } });
    // @ts-ignore
    require(['vs/editor/editor.main'], () => {
      const editor = monaco.editor.create(container, {
        value: `// Write your TypeScript code here
const greeting: string = "Hello, Twine!";
console.log(greeting);

// Try TypeScript features:
// const multiply = (a: number, b: number): number => a * b;
// console.log(multiply(5, 3));
`,
        language: 'typescript',
        theme: 'vs-dark',
        automaticLayout: true,
        minimap: { enabled: false },
        fontSize: 14,
      });

      monaco.languages.typescript.typescriptDefaults.setCompilerOptions({
        target: monaco.languages.typescript.ScriptTarget.ES2020,
        allowNonTsExtensions: true,
        moduleResolution: monaco.languages.typescript.ModuleResolutionKind.NodeJs,
        module: monaco.languages.typescript.ModuleKind.ESNext,
        noEmit: false,
        esModuleInterop: true,
        strict: true,
        skipLibCheck: true,
      });

      monaco.languages.typescript.typescriptDefaults.setDiagnosticsOptions({
        noSemanticValidation: false,
        noSyntaxValidation: false,
      });

      resolve(editor);
    });
  });
}

export function getEditorValue(editor: Editor): string {
  return editor.getValue();
}

export function setEditorValue(editor: Editor, code: string): void {
  editor.setValue(code);
}

export async function getCompiledCode(editor: Editor): Promise<string> {
  const model = editor.getModel();
  if (!model) {
    throw new Error('No editor model found');
  }

  const worker = await monaco.languages.typescript.getTypeScriptWorker();
  const client = await worker(model.uri);
  const result = await client.getEmitOutput(model.uri.toString());

  if (!result.outputFiles || result.outputFiles.length === 0) {
    throw new Error('No output from TypeScript compiler');
  }

  return result.outputFiles[0].text;
}
