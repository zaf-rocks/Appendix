import type { AppEntry } from "./catalog";
import { isUp } from "./catalog";

const OPEN_KEY = "appendix-opens";
const SAVE_KEY = "appendix-saves";
const FLINT_KEY = "appendix-flints";
const DESK_KEY = "appendix-desk-open";
const SLOTS_KEY = "appendix-desk-slots";
const REVIEW_N_KEY = "appendix-reviews-filed";
const BILLBOARD_KEY = "appendix-billboard";
const REPORT_KEY = "appendix-reports";
const PAY_KEY = "appendix-pays-billboard";

export const FLINT_BILLBOARD_COST = 24;
export const DESK_SIT_MS = 120000;

function canStore() {
  return typeof localStorage !== "undefined";
}

function readMap(key: string): Record<string, number> {
  if (!canStore()) return {};
  try {
    return JSON.parse(localStorage.getItem(key) || "{}") as Record<string, number>;
  } catch {
    return {};
  }
}

function writeMap(key: string, value: Record<string, number>) {
  if (!canStore()) return;
  localStorage.setItem(key, JSON.stringify(value));
}

export function bumpOpen(id: string) {
  const map = readMap(OPEN_KEY);
  map[id] = (map[id] || 0) + 1;
  writeMap(OPEN_KEY, map);
  return map[id];
}

export function openCount(id: string) {
  return readMap(OPEN_KEY)[id] || 0;
}

export function allOpens() {
  return readMap(OPEN_KEY);
}

export function savedIds(): string[] {
  if (!canStore()) return [];
  try {
    return JSON.parse(localStorage.getItem(SAVE_KEY) || "[]") as string[];
  } catch {
    return [];
  }
}

export function isSaved(id: string) {
  return savedIds().includes(id);
}

export function toggleSave(id: string) {
  if (!canStore()) return savedIds();
  const next = isSaved(id) ? savedIds().filter((x) => x !== id) : [...savedIds(), id];
  localStorage.setItem(SAVE_KEY, JSON.stringify(next));
  return next;
}

export function flintBalance() {
  if (!canStore()) return 0;
  const n = Number(localStorage.getItem(FLINT_KEY) || "0");
  return Number.isFinite(n) ? n : 0;
}

export function addFlints(n: number) {
  if (!canStore()) return 0;
  const next = Math.max(0, flintBalance() + n);
  localStorage.setItem(FLINT_KEY, String(next));
  return next;
}

export function spendFlints(n: number) {
  if (flintBalance() < n) return false;
  addFlints(-n);
  return true;
}

export function markDeskOpen(id: string) {
  const map = readMap(DESK_KEY);
  map[id] = Date.now();
  writeMap(DESK_KEY, map);
}

export function deskOpenAt(id: string) {
  return readMap(DESK_KEY)[id] || 0;
}

export function deskReady(id: string, ms = DESK_SIT_MS) {
  const at = deskOpenAt(id);
  return at > 0 && Date.now() - at >= ms;
}

type Slot = { id: string; kind: "s" | "r" };

function readSlots(): Slot[] {
  if (!canStore()) return [];
  try {
    const raw = JSON.parse(localStorage.getItem(SLOTS_KEY) || "[]") as Slot[];
    return Array.isArray(raw) ? raw.filter((s) => s && s.id) : [];
  } catch {
    return [];
  }
}

function writeSlots(slots: Slot[]) {
  if (!canStore()) return;
  localStorage.setItem(SLOTS_KEY, JSON.stringify(slots.slice(0, 3)));
}

function pool(catalog: AppEntry[]) {
  const done = new Set(doneIds());
  const live = catalog.filter((a) => isUp(a) && !done.has(a.id));
  const sponsored = live.filter((a) => a.sponsored);
  const rest = live.filter((a) => !sponsored.some((s) => s.id === a.id));
  return { live, sponsored: sponsored.length ? sponsored : live, rest: rest.length ? rest : live };
}

function pick(from: AppEntry[], exclude: Set<string>) {
  const ok = from.filter((a) => !exclude.has(a.id));
  if (!ok.length) return from[Math.floor(Math.random() * from.length)];
  return ok[Math.floor(Math.random() * ok.length)];
}

function fillThree(catalog: AppEntry[], current: Slot[]): Slot[] {
  const { sponsored, rest, live } = pool(catalog);
  const slots = current.filter((s) => live.some((a) => a.id === s.id)).slice(0, 3);
  const used = new Set(slots.map((s) => s.id));
  while (slots.filter((s) => s.kind === "s").length < 2 && slots.length < 3) {
    const a = pick(sponsored, used);
    if (!a) break;
    used.add(a.id);
    slots.push({ id: a.id, kind: "s" });
  }
  while (slots.length < 3) {
    const a = pick(rest, used);
    if (!a) break;
    used.add(a.id);
    slots.push({ id: a.id, kind: "r" });
  }
  while (slots.length < 3 && live.length) {
    const a = pick(live, used);
    if (!a) break;
    used.add(a.id);
    slots.push({ id: a.id, kind: "r" });
  }
  return slots.slice(0, 3);
}

export function deskTickets(catalog: AppEntry[]): AppEntry[] {
  const slots = fillThree(catalog, readSlots());
  writeSlots(slots);
  const map = new Map(catalog.map((a) => [a.id, a]));
  return slots.map((s) => map.get(s.id)).filter(Boolean) as AppEntry[];
}

export function replaceDeskSlot(id: string, catalog: AppEntry[]): AppEntry[] {
  const slots = readSlots();
  const i = slots.findIndex((s) => s.id === id);
  if (i < 0) return deskTickets(catalog);
  const { sponsored, rest, live } = pool(catalog);
  const used = new Set(slots.filter((_, n) => n !== i).map((s) => s.id));
  const kind = slots[i].kind;
  const a = pick(kind === "s" ? sponsored : rest, used) || pick(live, used);
  if (a) slots[i] = { id: a.id, kind };
  writeSlots(slots);
  return deskTickets(catalog);
}

export function reviewsFiled() {
  if (!canStore()) return 0;
  return Number(localStorage.getItem(REVIEW_N_KEY) || "0") || 0;
}

export function bumpReviewsFiled() {
  if (!canStore()) return 0;
  const n = reviewsFiled() + 1;
  localStorage.setItem(REVIEW_N_KEY, String(n));
  return n;
}

export function fourthReviewGate() {
  return reviewsFiled() >= 3;
}

export type BillboardState = { slots: number; period: string; paying: boolean };

function periodKey() {
  const d = new Date();
  return `${d.getUTCFullYear()}-${String(d.getUTCMonth() + 1).padStart(2, "0")}`;
}

export function billboardState(): BillboardState {
  const period = periodKey();
  const paying = canStore() && localStorage.getItem(PAY_KEY) === "1";
  if (!canStore()) return { slots: 0, period, paying: false };
  try {
    const raw = JSON.parse(localStorage.getItem(BILLBOARD_KEY) || "{}") as BillboardState;
    if (raw.period !== period) return { slots: 0, period, paying };
    return { slots: raw.slots || 0, period, paying: Boolean(raw.paying) || paying };
  } catch {
    return { slots: 0, period, paying };
  }
}

export function setPayingBillboard(on: boolean) {
  if (!canStore()) return;
  localStorage.setItem(PAY_KEY, on ? "1" : "0");
  const s = billboardState();
  localStorage.setItem(BILLBOARD_KEY, JSON.stringify({ ...s, paying: on }));
}

export function redeemBillboard() {
  if (!canStore()) return { ok: false as const, reason: "Open the yard in a browser." };
  const s = billboardState();
  const cap = s.paying ? 2 : 1;
  if (s.slots >= cap) return { ok: false as const, reason: s.paying ? "Second slot already stacked this period." : "Already redeemed this period. Pay $4.99 to stack a second." };
  if (!spendFlints(FLINT_BILLBOARD_COST)) return { ok: false as const, reason: `Need ${FLINT_BILLBOARD_COST} Flints.` };
  const next = { ...s, slots: s.slots + 1 };
  localStorage.setItem(BILLBOARD_KEY, JSON.stringify(next));
  return { ok: true as const, state: next };
}

export function reportBroken(id: string) {
  const map = readMap(REPORT_KEY);
  map[id] = Date.now();
  writeMap(REPORT_KEY, map);
}

export function isReported(id: string) {
  return Boolean(readMap(REPORT_KEY)[id]);
}

const SKIP_KEY = "appendix-desk-skips";
const DONE_KEY = "appendix-desk-done";
const FAV_KEY = "appendix-favs";
const CUSTOM_KEY = "appendix-custom";
const CUSTOM_NAME_KEY = "appendix-custom-name";
const ONBOARD_KEY = "appendix-flint-onboard";

export const FLINT_PROMO_COST = FLINT_BILLBOARD_COST;
export const SKIP_PER_DAY = 3;

function todayKey() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

export function skipState(): { n: number; date: string; left: number } {
  if (!canStore()) return { n: 0, date: todayKey(), left: SKIP_PER_DAY };
  try {
    const raw = JSON.parse(localStorage.getItem(SKIP_KEY) || "{}") as { n?: number; date?: string };
    if (raw.date !== todayKey()) return { n: 0, date: todayKey(), left: SKIP_PER_DAY };
    const n = raw.n || 0;
    return { n, date: raw.date, left: Math.max(0, SKIP_PER_DAY - n) };
  } catch {
    return { n: 0, date: todayKey(), left: SKIP_PER_DAY };
  }
}

export function skipDesk(id: string, catalog: AppEntry[]): { ok: boolean; tickets: AppEntry[]; reason?: string } {
  const s = skipState();
  if (s.left <= 0) {
    return { ok: false, tickets: deskTickets(catalog), reason: "Three skips today. Resets at midnight." };
  }
  if (canStore()) localStorage.setItem(SKIP_KEY, JSON.stringify({ date: todayKey(), n: s.n + 1 }));
  return { ok: true, tickets: replaceDeskSlot(id, catalog) };
}

export function doneIds(): string[] {
  if (!canStore()) return [];
  try {
    return JSON.parse(localStorage.getItem(DONE_KEY) || "[]") as string[];
  } catch {
    return [];
  }
}

export function markDeskDone(id: string) {
  if (!canStore()) return;
  const next = [...new Set([...doneIds(), id])];
  localStorage.setItem(DONE_KEY, JSON.stringify(next));
}

export function favIds(): string[] {
  if (!canStore()) return [];
  try {
    return JSON.parse(localStorage.getItem(FAV_KEY) || "[]") as string[];
  } catch {
    return [];
  }
}

export function toggleFav(id: string) {
  if (!canStore()) return favIds();
  const next = favIds().includes(id) ? favIds().filter((x) => x !== id) : [...favIds(), id];
  localStorage.setItem(FAV_KEY, JSON.stringify(next));
  return next;
}

export function customIds(): string[] {
  if (!canStore()) return [];
  try {
    return JSON.parse(localStorage.getItem(CUSTOM_KEY) || "[]") as string[];
  } catch {
    return [];
  }
}

export function customName() {
  if (!canStore()) return "My stack";
  return localStorage.getItem(CUSTOM_NAME_KEY) || "My stack";
}

export function setCustomName(name: string) {
  if (!canStore()) return;
  localStorage.setItem(CUSTOM_NAME_KEY, name.trim() || "My stack");
}

export function toggleCustom(id: string) {
  if (!canStore()) return customIds();
  const next = customIds().includes(id) ? customIds().filter((x) => x !== id) : [...customIds(), id];
  localStorage.setItem(CUSTOM_KEY, JSON.stringify(next));
  return next;
}

export function setSavedOrder(ids: string[]) {
  if (!canStore()) return;
  localStorage.setItem(SAVE_KEY, JSON.stringify(ids));
}

export function flintOnboarded() {
  return canStore() && localStorage.getItem(ONBOARD_KEY) === "1";
}

export function setFlintOnboarded() {
  if (!canStore()) return;
  localStorage.setItem(ONBOARD_KEY, "1");
}

export function redeemPromo() {
  return redeemBillboard();
}

export function shotUrl(url?: string) {
  if (!url || url === "#" || !url.startsWith("http")) return undefined;
  return `https://s0.wordpress.com/mshots/v1/${encodeURIComponent(url)}?w=720`;
}
