import * as monaco from "monaco-editor";

monaco.languages.register({ id: "typescript" });

const tm = monaco.editor.createModel(
  `import { Measure, watts } from "https://esm.sh/jsr/@isentropic/twine";

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
