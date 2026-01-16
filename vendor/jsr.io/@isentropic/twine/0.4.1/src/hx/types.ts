import type { Power, Temperature, ThermalConductance } from "../quantity/mod.ts";

/** Inlet conditions for a stream entering the heat exchanger */
export interface StreamInlet {
  /** Capacitance rate (ṁ×cₚ) - a ThermalConductance quantity */
  capacitanceRate: ThermalConductance;
  /** Inlet temperature (absolute) */
  temperature: Temperature;
}

/** Resolved state for a stream after traversing the exchanger */
export interface Stream {
  capacitanceRate: ThermalConductance;
  inletTemperature: Temperature;
  outletTemperature: Temperature;
  /** Heat flow into the stream (positive = heating, negative = cooling) */
  heatFlow: Power;
}

/** Result from solving a heat exchanger with known conductance and inlets */
export interface KnownConductanceAndInletsResult {
  /** Final state for each stream, same order as input */
  streams: [Stream, Stream];
  /** Effectiveness ε ∈ [0, 1] */
  effectiveness: number;
}

/** Raw result from WASM (SI values, snake_case) */
export interface RawStreamResult {
  capacitance_rate: number;
  inlet_temperature: number;
  outlet_temperature: number;
  heat_flow: number;
}

/** Raw result from WASM */
export interface RawHxResult {
  streams: [RawStreamResult, RawStreamResult];
  effectiveness: number;
}
