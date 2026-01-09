import { editor, getCompiledCode } from "./editor.ts";
import { executeCode } from "./runner.ts";
import { renderOutput } from "./output.ts";

function main() {
  const editorContainer = document.getElementById("editor-container");
  const outputContainer = document.getElementById("output");
  const runButton = document.getElementById("run-button");

  if (!editorContainer || !outputContainer || !runButton) {
    console.error("Required DOM elements not found");
    return;
  }

  runButton.addEventListener("click", handleRun);

  document.addEventListener("keydown", (e) => {
    if ((e.metaKey || e.ctrlKey) && e.key === "Enter") {
      e.preventDefault();
      handleRun();
    }
  });
}

async function handleRun() {
  const outputContainer = document.getElementById("output");
  if (!outputContainer || !editor) {
    return;
  }

  try {
    const compiledCode = await getCompiledCode(editor);
    const result = await executeCode(compiledCode);
    renderOutput(outputContainer, result.messages);
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    renderOutput(outputContainer, [{ type: "error", content: message }]);
  }
}

main();
