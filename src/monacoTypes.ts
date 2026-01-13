// Import all safe-units type definitions using Vite's ?raw suffix
// Main entry point
import safeUnitsIndex from "../node_modules/.deno/safe-units@2.0.1/node_modules/safe-units/dist/src/index.d.ts?raw";

// Measure types
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

// Unit types
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

export interface TypeDefinition {
  path: string;
  content: string;
}

export const typeDefs: TypeDefinition[] = [
  { path: "file:///node_modules/safe-units/dist/src/index.d.ts", content: safeUnitsIndex },
  { path: "file:///node_modules/safe-units/dist/src/measure/index.d.ts", content: measureIndex },
  { path: "file:///node_modules/safe-units/dist/src/measure/genericMeasure.d.ts", content: genericMeasure },
  { path: "file:///node_modules/safe-units/dist/src/measure/genericMeasureClass.d.ts", content: genericMeasureClass },
  { path: "file:///node_modules/safe-units/dist/src/measure/genericMeasureFactory.d.ts", content: genericMeasureFactory },
  { path: "file:///node_modules/safe-units/dist/src/measure/genericMeasureStatic.d.ts", content: genericMeasureStatic },
  { path: "file:///node_modules/safe-units/dist/src/measure/genericMeasureUtils.d.ts", content: genericMeasureUtils },
  { path: "file:///node_modules/safe-units/dist/src/measure/numberMeasure.d.ts", content: numberMeasure },
  { path: "file:///node_modules/safe-units/dist/src/measure/unitSystem.d.ts", content: unitSystem },
  { path: "file:///node_modules/safe-units/dist/src/measure/unitTypeArithmetic.d.ts", content: unitTypeArithmetic },
  { path: "file:///node_modules/safe-units/dist/src/measure/exponentTypeArithmetic.d.ts", content: exponentTypeArithmetic },
  { path: "file:///node_modules/safe-units/dist/src/measure/format.d.ts", content: formatTypes },
  { path: "file:///node_modules/safe-units/dist/src/unit/index.d.ts", content: unitIndex },
  { path: "file:///node_modules/safe-units/dist/src/unit/angle.d.ts", content: angleTypes },
  { path: "file:///node_modules/safe-units/dist/src/unit/base.d.ts", content: baseTypes },
  { path: "file:///node_modules/safe-units/dist/src/unit/common.d.ts", content: commonTypes },
  { path: "file:///node_modules/safe-units/dist/src/unit/memory.d.ts", content: memoryTypes },
  { path: "file:///node_modules/safe-units/dist/src/unit/metric.d.ts", content: metricTypes },
  { path: "file:///node_modules/safe-units/dist/src/unit/other.d.ts", content: otherTypes },
  { path: "file:///node_modules/safe-units/dist/src/unit/quantities.d.ts", content: quantitiesTypes },
  { path: "file:///node_modules/safe-units/dist/src/unit/imperial.d.ts", content: imperialTypes },
  { path: "file:///node_modules/safe-units/dist/src/unit/trig.d.ts", content: trigTypes },
  { path: "file:///node_modules/safe-units/dist/src/unit/uscu.d.ts", content: uscuTypes },
];

// Maps the ESM CDN URL to the safe-units types
export const esmMapping = `declare module "https://esm.sh/jsr/@isentropic/twine" {
  export * from "safe-units/dist/src/index";
}`;
