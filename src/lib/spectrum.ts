/** Galactic wheel. The middle of every triad is the dominant color. */
const WHEEL = [
  "#ff6ec7", // bubblegum
  "#ff2bd6", // magenta
  "#ff1744", // red
  "#ff6a00", // orange
  "#ffe600", // yellow
  "#d6ff00", // lime
  "#00e676", // forest
  "#00f5d4", // turquoise
  "#3dc9ff", // sky
  "#1a4bff", // navy
  "#4f2bff", // indigo
  "#c084ff", // violet
  "#9b30ff", // regal
] as const;

function triad(i: number, step: number): [string, string, string] {
  const n = WHEEL.length;
  return [WHEEL[i % n], WHEEL[(i + step) % n], WHEEL[(i + step * 2) % n]];
}

/** Adjacent triples, then skip-one, then skip-two, and on. Middle color dominates. */
export const SPECTRUM: [string, string, string][] = [1, 2, 3, 4].flatMap((step) =>
  WHEEL.map((_, i) => triad(i, step)),
);

export function specTri(i: number): [string, string, string] {
  return SPECTRUM[Math.abs(i) % SPECTRUM.length];
}

import type { CSSProperties } from "react";

export function specVars(i: number): CSSProperties {
  const [c1, c2, c3] = specTri(i);
  return { "--c1": c1, "--c2": c2, "--c3": c3 } as CSSProperties;
}
