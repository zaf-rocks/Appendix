export const LETTERS = [
  { id: "a", label: "Suggested" },
  { id: "b", label: "Top charts" },
  { id: "c", label: "Unconventional" },
  { id: "d", label: "For crowds" },
  { id: "e", label: "Categories" },
  { id: "f", label: "Editors' Choice" },
] as const;

export type LetterId = (typeof LETTERS)[number]["id"];

export function neighborLetter(id: string | undefined, dir: 1 | -1): LetterId {
  const i = Math.max(0, LETTERS.findIndex((l) => l.id === id));
  const next = (i + dir + LETTERS.length) % LETTERS.length;
  return LETTERS[next].id;
}
