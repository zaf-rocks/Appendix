import { GENRE_META, type AppEntry } from "@/lib/catalog";

export const TAG_CAP = 10;

export const TAG_LIST = [
  "Offline",
  "Installable",
  "Vibe",
  "Pro",
  "AI-built",
  "Free",
  "Paid",
  "No account",
  "Accounts",
  "Solo",
  "Multiplayer",
  "Editor",
  "Notes",
  "Timer",
  "Chat",
  "Camera",
  "Audio",
  "Karaoke",
  "Puzzle",
  "Arcade",
  "Kids",
  "Classroom",
  "Maps",
  "Finance",
  "Health",
  "Food",
  "Travel",
  "News",
  "Read",
  "Write",
  "Draw",
  "Code",
  "Design",
  "Open source",
  "Experimental",
  "Local-first",
];

export function cleanTag(raw: string) {
  const t = raw.trim().replace(/\s+/g, " ").slice(0, 24);
  return t;
}

export function baseTags(app: Pick<AppEntry, "genres" | "platform" | "provenance" | "offline" | "installable" | "aiBuilt" | "paid">) {
  const tags = new Set<string>();
  for (const g of app.genres) {
    const label = GENRE_META[g]?.label;
    if (label) tags.add(label);
  }
  if (app.platform && app.platform !== "Unknown") tags.add(app.platform);
  tags.add(app.provenance === "pro" ? "Pro" : "Vibe");
  if (app.offline) tags.add("Offline");
  if (app.installable) tags.add("Installable");
  if (app.aiBuilt) tags.add("AI-built");
  if (app.paid) tags.add("Paid");
  else tags.add("Free");
  return [...tags].slice(0, TAG_CAP);
}

export function mergeTags(base: string[], extra: string[], blocked: Set<string>) {
  const out: string[] = [];
  for (const raw of [...base, ...extra]) {
    const t = cleanTag(raw);
    if (!t || blocked.has(t.toLowerCase())) continue;
    if (out.some((x) => x.toLowerCase() === t.toLowerCase())) continue;
    out.push(t);
    if (out.length >= TAG_CAP) break;
  }
  return out;
}
