import type { AppEntry } from "./catalog";
import type { Lens } from "./lens";

export const VIBE_PLATFORMS = new Set([
  "Grok",
  "Lovable",
  "Floot",
  "Bolt",
  "v0",
  "Replit",
  "Emergent",
  "Base44",
  "Rork",
  "Softgen",
  "Anything",
  "Create",
  "Tempo",
  "Dynamous",
  "CatDoes",
  "A0",
  "a0.dev",
  "Glide",
  "Bubble",
  "Adalo",
  "Softr",
]);

const PRO_DEVS = /google|microsoft|apple|spotify|linear|notion|figma|canva|github|adobe|mozilla|new york times|washington post|bloomberg|discord|slack|dropbox|autodesk|photopea|nintendo|amazon|netflix|openai|meta|facebook|instagram|twitter|x corp|square|shopify|stripe|airbnb|uber|lyft|zoom|cisco|oracle|salesforce|ibm|intel|nvidia|samsung|sony|bbc|cnn|reuters|nytimes|wapo/i;

export function inferProvenance(p: {
  provenance?: "vibe" | "pro";
  developer?: string;
  platform?: string;
  aiBuilt?: boolean;
  source?: string;
  id?: string;
}): "vibe" | "pro" {
  if (p.provenance === "vibe" || p.provenance === "pro") return p.provenance;
  if (p.source === "ZAF") return "vibe";
  if (p.aiBuilt) return "vibe";
  if (p.platform && VIBE_PLATFORMS.has(p.platform)) return "vibe";
  if (p.developer && PRO_DEVS.test(p.developer)) return "pro";
  return "vibe";
}

export function throughLens(apps: AppEntry[], lens: Lens): AppEntry[] {
  if (lens === "all") return apps;
  return apps.filter((a) => (a.provenance || "vibe") === "vibe");
}

export function inferRoles(p: { roles?: string[]; genres?: string[]; name?: string; developer?: string }): string[] {
  if (p.roles?.length) return p.roles;
  const g = p.genres || [];
  const n = `${p.name || ""} ${p.developer || ""}`.toLowerCase();
  const roles: string[] = [];
  if (g.includes("music")) {
    if (/karaoke|bandlab|soundtrap|splice|output|ableton|amadeus|preset|studio/.test(n)) {
      roles.push("singers", "producers", "band", "session");
    } else if (/dj|mixcloud|serato/.test(n)) {
      roles.push("djs", "producers");
    } else {
      roles.push("listeners", "collectors");
    }
  }
  if (g.includes("games")) {
    if (/puzzle|2048|hextris|sudoku|wordle|proxx/.test(n)) roles.push("puzzle", "solo");
    else if (/krunker|surviv|io/.test(n)) roles.push("competitive");
    else roles.push("solo", "couch");
  }
  if (g.includes("photo")) {
    if (/edit|pea|lightroom|squoosh|svg/.test(n)) roles.push("editors");
    else roles.push("shooters", "sharers");
  }
  if (g.includes("tools") || g.includes("productivity")) {
    if (/docs|mdn|devdocs|caniuse/.test(n)) roles.push("docs", "shipping");
    else roles.push("weekend", "shipping");
  }
  if (g.includes("education")) {
    if (/classroom|khan|coursera/.test(n)) roles.push("classroom");
    else roles.push("learn", "tutors");
  }
  if (g.includes("kids")) roles.push("play", "learn", "watch");
  if (g.includes("shopping")) roles.push("browse", "deal-hunt", "lists");
  if (g.includes("health")) roles.push("train", "track", "recover");
  if (g.includes("entertainment") || g.includes("video")) roles.push("watch", "log");
  return [...new Set(roles)];
}
