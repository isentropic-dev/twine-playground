import { hx_known_conductance_and_inlets } from "../../lib/twine_wasm.js";
import type { ThermalConductance } from "../quantity/mod.ts";
import { fromSI, toSI } from "../interop.ts";
import type { Arrangement } from "./arrangements.ts";
import type {
  KnownConductanceAndInletsResult,
  RawHxResult,
  RawStreamResult,
  Stream,
  StreamInlet,
} from "./types.ts";

function wrapStream(raw: RawStreamResult): Stream {
  return {
    capacitanceRate: fromSI.thermalConductance(raw.capacitance_rate),
    inletTemperature: fromSI.temperatureAbsolute(raw.inlet_temperature),
    outletTemperature: fromSI.temperatureAbsolute(raw.outlet_temperature),
    heatFlow: fromSI.power(raw.heat_flow),
  };
}

/**
 * Heat exchanger solver configured with a specific flow arrangement.
 *
 * @example
 * ```typescript
 * import { Measure, celsius, watts, kelvin, kilo } from "@isentropic/twine/quantity";
 * import { Hx, CounterFlow } from "@isentropic/twine/hx";
 *
 * const hx = new Hx(CounterFlow);
 * const kW_K = kilo(watts).per(kelvin);
 *
 * const result = hx.knownConductanceAndInlets({
 *   ua: Measure.of(0.5, kW_K),
 *   inlets: [
 *     { capacitanceRate: Measure.of(3, kW_K), temperature: celsius(50) },
 *     { capacitanceRate: Measure.of(6, kW_K), temperature: celsius(80) },
 *   ],
 * });
 *
 * console.log(result.effectiveness);
 * console.log(result.streams[0].outletTemperature.valueIn(kelvin) - 273.15); // in celsius
 * ```
 */
export class Hx {
  constructor(private arrangement: Arrangement) {}

  /**
   * Solve for outlet conditions when conductance (UA) and inlet states are known.
   *
   * @throws {Error} If capacitance rates are non-positive or other constraints are violated
   */
  knownConductanceAndInlets(options: {
    /** Overall heat transfer conductance (UA) */
    ua: ThermalConductance;
    /** Inlet conditions for both streams */
    inlets: [StreamInlet, StreamInlet];
  }): KnownConductanceAndInletsResult {
    const { ua, inlets } = options;

    const raw = hx_known_conductance_and_inlets(
      this.arrangement,
      toSI.thermalConductance(ua),
      toSI.thermalConductance(inlets[0].capacitanceRate),
      toSI.temperatureAbsolute(inlets[0].temperature),
      toSI.thermalConductance(inlets[1].capacitanceRate),
      toSI.temperatureAbsolute(inlets[1].temperature),
    ) as RawHxResult;

    return {
      streams: [wrapStream(raw.streams[0]), wrapStream(raw.streams[1])],
      effectiveness: raw.effectiveness,
    };
  }
}
