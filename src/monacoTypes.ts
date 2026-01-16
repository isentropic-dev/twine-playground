// Safe-units type definitions (npm package)
import safeUnitsIndex from "../node_modules/.deno/safe-units@2.0.1/node_modules/safe-units/dist/src/index.d.ts?raw";
import measureIndex from "../node_modules/.deno/safe-units@2.0.1/node_modules/safe-units/dist/src/measure/index.d.ts?raw";
import genericMeasure from "../node_modules/.deno/safe-units@2.0.1/node_modules/safe-units/dist/src/measure/genericMeasure.d.ts?raw";
import genericMeasureClass from "../node_modules/.deno/safe-units@2.0.1/node_modules/safe-units/dist/src/measure/genericMeasureClass.d.ts?raw";
import genericMeasureFactory from "../node_modules/.deno/safe-units@2.0.1/node_modules/safe-units/dist/src/measure/genericMeasureFactory.d.ts?raw";
import genericMeasureStatic from "../node_modules/.deno/safe-units@2.0.1/node_modules/safe-units/dist/src/measure/genericMeasureStatic.d.ts?raw";
import genericMeasureUtils from "../node_modules/.deno/safe-units@2.0.1/node_modules/safe-units/dist/src/measure/genericMeasureUtils.d.ts?raw";
import numberMeasure from "../node_modules/.deno/safe-units@2.0.1/node_modules/safe-units/dist/src/measure/numberMeasure.d.ts?raw";
import unitSystem from "../node_modules/.deno/safe-units@2.0.1/node_modules/safe-units/dist/src/measure/unitSystem.d.ts?raw";
import unitTypeArithmetic from "../node_modules/.deno/safe-units@2.0.1/node_modules/safe-units/dist/src/measure/unitTypeArithmetic.d.ts?raw";
import exponentTypeArithmetic from "../node_modules/.deno/safe-units@2.0.1/node_modules/safe-units/dist/src/measure/exponentTypeArithmetic.d.ts?raw";
import formatTypes from "../node_modules/.deno/safe-units@2.0.1/node_modules/safe-units/dist/src/measure/format.d.ts?raw";
import unitIndex from "../node_modules/.deno/safe-units@2.0.1/node_modules/safe-units/dist/src/unit/index.d.ts?raw";
import angleTypes from "../node_modules/.deno/safe-units@2.0.1/node_modules/safe-units/dist/src/unit/angle.d.ts?raw";
import baseTypes from "../node_modules/.deno/safe-units@2.0.1/node_modules/safe-units/dist/src/unit/base.d.ts?raw";
import commonTypes from "../node_modules/.deno/safe-units@2.0.1/node_modules/safe-units/dist/src/unit/common.d.ts?raw";
import memoryTypes from "../node_modules/.deno/safe-units@2.0.1/node_modules/safe-units/dist/src/unit/memory.d.ts?raw";
import metricTypes from "../node_modules/.deno/safe-units@2.0.1/node_modules/safe-units/dist/src/unit/metric.d.ts?raw";
import otherTypes from "../node_modules/.deno/safe-units@2.0.1/node_modules/safe-units/dist/src/unit/other.d.ts?raw";
import quantitiesTypes from "../node_modules/.deno/safe-units@2.0.1/node_modules/safe-units/dist/src/unit/quantities.d.ts?raw";
import imperialTypes from "../node_modules/.deno/safe-units@2.0.1/node_modules/safe-units/dist/src/unit/imperial.d.ts?raw";
import trigTypes from "../node_modules/.deno/safe-units@2.0.1/node_modules/safe-units/dist/src/unit/trig.d.ts?raw";
import uscuTypes from "../node_modules/.deno/safe-units@2.0.1/node_modules/safe-units/dist/src/unit/uscu.d.ts?raw";

// Twine type definitions (JSR package, vendored)
import twineQuantityMod from "../vendor/jsr.io/@isentropic/twine/0.4.1/src/quantity/mod.ts?raw";
import twineHxMod from "../vendor/jsr.io/@isentropic/twine/0.4.1/src/hx/mod.ts?raw";
import twineHxClass from "../vendor/jsr.io/@isentropic/twine/0.4.1/src/hx/Hx.ts?raw";
import twineHxTypes from "../vendor/jsr.io/@isentropic/twine/0.4.1/src/hx/types.ts?raw";
import twineHxArrangements from "../vendor/jsr.io/@isentropic/twine/0.4.1/src/hx/arrangements.ts?raw";
import twineInterop from "../vendor/jsr.io/@isentropic/twine/0.4.1/src/interop.ts?raw";
import twineWasmTypes from "../vendor/jsr.io/@isentropic/twine/0.4.1/lib/twine_wasm.d.ts?raw";

export interface TypeDefinition {
  path: string;
  content: string;
}

/** Rewrite Deno-style import specifiers to bare module specifiers for Monaco. */
function rewriteTwineImports(content: string, modulePath: string): string {
  const baseDir = modulePath.replace(/\/[^/]+$/, "");

  return content
    // npm:safe-units -> bare specifier
    .replace(
      /(from|export \* from)\s+["']npm:safe-units@\^2\.0\.1["']/g,
      '$1 "safe-units/dist/src/index"',
    )
    // Relative .ts imports -> absolute bare specifiers
    .replace(/from\s+["'](\.[^"']+)\.ts["']/g, (_match, relPath) => {
      const parts = baseDir.split("/");
      for (const part of relPath.split("/")) {
        if (part === "..") parts.pop();
        else if (part !== ".") parts.push(part);
      }
      return `from "${parts.join("/")}"`;
    })
    // WASM import
    .replace(
      /from\s+["'][^"']*twine_wasm\.js["']/g,
      'from "@isentropic/twine/lib/twine_wasm"',
    );
}

// Safe-units types registered at file:///node_modules/safe-units/...
const safeUnitsTypes: [string, string][] = [
  ["index.d.ts", safeUnitsIndex],
  ["measure/index.d.ts", measureIndex],
  ["measure/genericMeasure.d.ts", genericMeasure],
  ["measure/genericMeasureClass.d.ts", genericMeasureClass],
  ["measure/genericMeasureFactory.d.ts", genericMeasureFactory],
  ["measure/genericMeasureStatic.d.ts", genericMeasureStatic],
  ["measure/genericMeasureUtils.d.ts", genericMeasureUtils],
  ["measure/numberMeasure.d.ts", numberMeasure],
  ["measure/unitSystem.d.ts", unitSystem],
  ["measure/unitTypeArithmetic.d.ts", unitTypeArithmetic],
  ["measure/exponentTypeArithmetic.d.ts", exponentTypeArithmetic],
  ["measure/format.d.ts", formatTypes],
  ["unit/index.d.ts", unitIndex],
  ["unit/angle.d.ts", angleTypes],
  ["unit/base.d.ts", baseTypes],
  ["unit/common.d.ts", commonTypes],
  ["unit/memory.d.ts", memoryTypes],
  ["unit/metric.d.ts", metricTypes],
  ["unit/other.d.ts", otherTypes],
  ["unit/quantities.d.ts", quantitiesTypes],
  ["unit/imperial.d.ts", imperialTypes],
  ["unit/trig.d.ts", trigTypes],
  ["unit/uscu.d.ts", uscuTypes],
];

// Twine types registered at file:///node_modules/@isentropic/twine/...
const twineTypes: [string, string, string][] = [
  ["src/quantity/mod.ts", twineQuantityMod, "@isentropic/twine/src/quantity/mod"],
  ["src/hx/mod.ts", twineHxMod, "@isentropic/twine/src/hx/mod"],
  ["src/hx/Hx.ts", twineHxClass, "@isentropic/twine/src/hx/Hx"],
  ["src/hx/types.ts", twineHxTypes, "@isentropic/twine/src/hx/types"],
  ["src/hx/arrangements.ts", twineHxArrangements, "@isentropic/twine/src/hx/arrangements"],
  ["src/interop.ts", twineInterop, "@isentropic/twine/src/interop"],
];

export const typeDefs: TypeDefinition[] = [
  // Safe-units
  ...safeUnitsTypes.map(([file, content]) => ({
    path: `file:///node_modules/safe-units/dist/src/${file}`,
    content,
  })),
  // Twine (with import rewriting)
  ...twineTypes.map(([file, content, modulePath]) => ({
    path: `file:///node_modules/@isentropic/twine/${file}`,
    content: rewriteTwineImports(content, modulePath),
  })),
  // Twine WASM types (no rewriting needed)
  {
    path: "file:///node_modules/@isentropic/twine/lib/twine_wasm.d.ts",
    content: twineWasmTypes,
  },
];

// Map ESM CDN URLs to registered types
export const esmMapping = `
declare module "https://esm.sh/jsr/@isentropic/twine@0.4.1/quantity" {
  export * from "safe-units/dist/src/index";
  export { ThermalConductance, celsius } from "@isentropic/twine/src/quantity/mod";
}
declare module "https://esm.sh/jsr/@isentropic/twine@0.4.1/hx" {
  export * from "@isentropic/twine/src/hx/mod";
}
`;
