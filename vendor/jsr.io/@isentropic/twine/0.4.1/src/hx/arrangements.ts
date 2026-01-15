// Simple arrangements (zero-config marker objects)
export const CounterFlow = { type: "counter-flow" } as const;
export const ParallelFlow = { type: "parallel-flow" } as const;

// Parameterized arrangements (factory functions)
export const CrossFlow = (
  stream1: "mixed" | "unmixed",
  stream2: "mixed" | "unmixed",
) => ({ type: "cross-flow", stream1, stream2 }) as const;

export const ShellAndTube = (shellPasses: number, tubePasses: number) =>
  ({ type: "shell-and-tube", shellPasses, tubePasses }) as const;

export type Arrangement =
  | typeof CounterFlow
  | typeof ParallelFlow
  | ReturnType<typeof CrossFlow>
  | ReturnType<typeof ShellAndTube>;
