import { defineConfig } from "vite";
import deno from "@deno/vite-plugin";
import monacoEditorPlugin from "vite-plugin-monaco-editor";

export default defineConfig({
  base: "/twine-playground/",
  plugins: [
    deno(),
    monacoEditorPlugin.default({
      languageWorkers: ["editorWorkerService", "typescript"],
      customDistPath: (root: string, buildOutDir: string, base: string) => `${buildOutDir}/monacoeditorwork`
    }),
  ],
});
