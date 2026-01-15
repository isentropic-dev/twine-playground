// Re-export everything from safe-units
export * from "npm:safe-units@^2.0.1";

import {
  type GenericMeasure,
  kelvin,
  type LiftMeasure,
  Measure,
  Power,
  type SIUnitSystem,
  Temperature,
} from "npm:safe-units@^2.0.1";

/**
 * ThermalConductance quantity type (W/K).
 *
 * Used for heat transfer coefficients, capacitance rates (ṁ×cₚ), etc.
 */
export type ThermalConductance<N = number> = LiftMeasure<typeof ThermalConductance, N>;
const ThermalConductance: GenericMeasure<
  number,
  SIUnitSystem,
  /** Dimensions for ThermalConductance (W/K = kg·m²/(s³·K)) */
  Readonly<
    {
      readonly length: 2;
      readonly mass: 1;
      readonly time: -3;
      readonly current: 0;
      readonly temperature: -1;
      readonly substance: 0;
      readonly intensity: 0;
      readonly planeAngle: 0;
      readonly solidAngle: 0;
      readonly memory: 0;
    }
  >
> = Power.over(
  Temperature,
);

/**
 * Create a Temperature from a celsius value.
 *
 * safe-units doesn't support temperature offsets, so celsius is provided
 * as a function rather than a unit.
 *
 * @example
 * ```typescript
 * const temp = celsius(50);  // 50°C as absolute temperature
 * temp.valueIn(kelvin);      // 323.15
 * ```
 */
export function celsius(value: number): Temperature {
  return Measure.of(value + 273.15, kelvin);
}
