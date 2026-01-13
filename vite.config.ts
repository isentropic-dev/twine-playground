import { defineConfig } from "vite";
import deno from "@deno/vite-plugin";
import monacoEditorPlugin from "vite-plugin-monaco-editor";

export default defineConfig({
  base: "/twine-playground/",
  plugins: [
    deno(),
    monacoEditorPlugin.default({ languageWorkers: ["typescript"] }),
  ],
});
