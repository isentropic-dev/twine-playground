import * as monaco from "monaco-editor";
import { esmMapping, typeDefs } from "./monacoTypes.ts";

// Configure TypeScript compiler options
monaco.languages.typescript.typescriptDefaults.setCompilerOptions({
  target: monaco.languages.typescript.ScriptTarget.ES2020,
  module: monaco.languages.typescript.ModuleKind.ESNext,
  moduleResolution: monaco.languages.typescript.ModuleResolutionKind.NodeJs,
  strict: true,
  esModuleInterop: true,
  allowSyntheticDefaultImports: true,
});

// Register all type definitions with Monaco
for (const { path, content } of typeDefs) {
  monaco.languages.typescript.typescriptDefaults.addExtraLib(content, path);
}

// Map ESM URL to safe-units module
monaco.languages.typescript.typescriptDefaults.addExtraLib(
  esmMapping,
  "file:///node_modules/@types/esm-sh-mappings.d.ts",
);

console.log(`✓ Registered ${typeDefs.length + 1} type definitions`);

monaco.languages.register({ id: "typescript" });

const tm = monaco.editor.createModel(
  `import { Measure, watts } from "https://esm.sh/jsr/@isentropic/twine@0.4.1/quantity";

const power = Measure.of(5, watts);
console.log(\`Power: \${power}\`);`,
  "typescript",
  monaco.Uri.parse("file:///main.ts"),
);

export const editor = monaco.editor.create(
  document.getElementById("editor-container")!,
  {
    model: tm,
    language: "typescript",
    theme: "vs",
  },
);

export async function getCompiledCode(
  editor: monaco.editor.IStandaloneCodeEditor,
): Promise<string> {
  const model = editor.getModel();
  if (!model) {
    throw new Error("No editor model found");
  }

  const worker = await monaco.typescript.getTypeScriptWorker();
  const client = await worker(model.uri);
  const result = await client.getEmitOutput(model.uri.toString());

  if (!result.outputFiles || result.outputFiles.length === 0) {
    throw new Error("No output from TypeScript compiler");
  }

  return result.outputFiles[0].text;
}
