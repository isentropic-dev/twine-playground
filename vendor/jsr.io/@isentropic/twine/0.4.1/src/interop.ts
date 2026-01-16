import {
  kelvin,
  Measure,
  type Power,
  type Temperature,
  type ThermalConductance,
  watts,
} from "./quantity/mod.ts";

export const toSI = {
  power: (v: Power) => v.valueIn(watts),
  temperatureAbsolute: (v: Temperature) => v.valueIn(kelvin),
  thermalConductance: (v: ThermalConductance) => v.valueIn(watts.per(kelvin)),
} as const;

export const fromSI = {
  power: (v: number) => Measure.of(v, watts),
  temperatureAbsolute: (v: number) => Measure.of(v, kelvin),
  thermalConductance: (v: number) => Measure.of(v, watts.per(kelvin)),
} as const;

export const SUPPORTED_QUANTITIES = Object.keys(toSI) as (keyof typeof toSI)[];
