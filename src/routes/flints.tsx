import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { PlayShell } from "@/components/play-shell";
import { AppIcon } from "@/components/app-icon";
import { isUp } from "@/lib/catalog";
import { listStore } from "@/lib/store-api";
import {
  FLINT_PROMO_COST,
  deskTickets,
  flintBalance,
  flintOnboarded,
  markDeskOpen,
  redeemPromo,
  setFlintOnboarded,
  skipDesk,
  skipState,
} from "@/lib/yard";
import type { AppEntry } from "@/lib/catalog";
import { useLens } from "@/lib/lens";
import { throughLens } from "@/lib/provenance";
import { useCurrentUserState } from "@/lib/auth/use-current-user";
import { cn } from "@/lib/cn";

const PLATS = ["Grok", "Lovable", "Bolt", "v0", "Replit", "Bubble", "Glide", "Softr", "Emergent", "ChatGPT", "Gemini", "Cursor"];
const CATS = ["Games", "Tools", "Music", "Photo", "Business", "Education", "Social", "Health"];

export const Route = createFileRoute("/flints")({
  loader: () => listStore(),
  component: Flints,
});

function Flints() {
  const raw = Route.useLoaderData();
  const { lens } = useLens();
  const catalog = throughLens(raw, lens);
  const { user, isPending } = useCurrentUserState();
  const [n, setN] = useState(0);
  const [tickets, setTickets] = useState<AppEntry[]>([]);
  const [note, setNote] = useState<string | null>(null);
  const [skips, setSkips] = useState(3);
  const [monitor, setMonitor] = useState<"off" | "how" | "redeem" | "dev" | "price">("off");
  const [onboard, setOnboard] = useState(0);
  const [wit, setWit] = useState("");
  const [learn, setLearn] = useState(false);
  const [openCubicle, setOpenCubicle] = useState(false);
  const [heard, setHeard] = useState<string[]>([]);
  const [used, setUsed] = useState<string[]>([]);
  const [other, setOther] = useState("");
  const [cats, setCats] = useState<string[]>([]);
  const [readyOnboard, setReadyOnboard] = useState(false);

  const live = useMemo(() => catalog.filter(isUp), [catalog]);

  useEffect(() => {
    setN(flintBalance());
    setTickets(deskTickets(live.length ? live : catalog));
    setSkips(skipState().left);
    setReadyOnboard(flintOnboarded());
  }, [catalog, live]);

  function skip(id: string) {
    const r = skipDesk(id, live.length ? live : catalog);
    setTickets(r.tickets);
    setSkips(skipState().left);
    setNote(r.ok ? null : r.reason || null);
  }

  function redeem() {
    const r = redeemPromo();
    setN(flintBalance());
    setNote(
      r.ok
        ? "One week of sponsored eyes for one app. Visibility, not a badge."
        : r.reason,
    );
  }

  if (!isPending && !user) {
    return (
      <PlayShell heroTitle="Flints" heroLine="Appendix loyalty coins. Mystery until you sign in.">
        <p className="text-[13px] text-muted">
          Flints are how the yard pays people who actually sit with an app, write a real
          sentence, and help the catalog get less wrong. They unlock free promotion — eyes,
          not stars.
        </p>
        <p className="mt-2 text-[12px] text-muted">
          Sign in to open your cubicle, earn, and redeem. Identity works too.
        </p>
        <Link
          to="/login"
          className="mt-4 inline-flex h-10 items-center rounded-full bg-get px-4 text-[13px] font-semibold text-get-fg"
        >
          Sign in or create account
        </Link>
      </PlayShell>
    );
  }

  if (user && !readyOnboard) {
    const step = onboard + 1;
    return (
      <PlayShell heroTitle="Flints" heroLine="Five questions. Then a boring cubicle hiding a loud monitor.">
        <p className="text-[11px] text-muted">{step} of 5</p>
        <button type="button" onClick={() => setLearn(true)} className="mt-1 text-[11px] text-primary">
          Learn more
        </button>
        {onboard === 0 ? (
          <>
            <p className="mt-3 text-[14px] font-medium">Do you already know what a PWA is?</p>
            <div className="mt-3 flex flex-wrap gap-2">
              {["Installed one", "Heard the letters", "Educate me"].map((l) => (
                <button
                  key={l}
                  type="button"
                  onClick={() => {
                    setWit(
                      l === "Educate me"
                        ? "A Progressive Web App is a website that can live on your home screen. No store clerk."
                        : "Good. Then you already know why this yard exists.",
                    );
                    setOnboard(1);
                  }}
                  className="chip-lens h-8 rounded-full px-3"
                >
                  {l}
                </button>
              ))}
            </div>
          </>
        ) : onboard === 1 ? (
          <>
            {wit ? <p className="text-[12px] text-muted">{wit}</p> : null}
            <p className="mt-3 text-[14px] font-medium">Are you familiar with vibe coding?</p>
            <div className="mt-3 flex gap-2">
              {["Yes", "I've heard of it", "No"].map((l) => (
                <button
                  key={l}
                  type="button"
                  onClick={() => {
                    setWit(
                      l === "No"
                        ? "You describe the app. The machine writes the first draft. That’s the whole trick."
                        : "Then you know the smell of a first-day app. Welcome.",
                    );
                    setOnboard(2);
                  }}
                  className="chip-lens h-8 rounded-full px-3"
                >
                  {l}
                </button>
              ))}
            </div>
          </>
        ) : onboard === 2 ? (
          <>
            {wit ? <p className="text-[12px] text-muted">{wit}</p> : null}
            <p className="mt-3 text-[14px] font-medium">Which builders have you heard of?</p>
            <div className="mt-2 flex flex-wrap gap-1">
              {PLATS.map((p) => (
                <button
                  key={p}
                  type="button"
                  onClick={() => setHeard((h) => (h.includes(p) ? h.filter((x) => x !== p) : [...h, p]))}
                  className={cn("chip-lens h-7 rounded-full px-2.5 text-[11px]", heard.includes(p) && "chip-lens-on")}
                >
                  {p}
                </button>
              ))}
            </div>
            <input
              value={other}
              onChange={(e) => setOther(e.target.value)}
              placeholder="Other, comma-separated"
              className="mt-2 h-8 w-full rounded-md border border-border bg-surface px-2 text-[12px]"
            />
            <button
              type="button"
              onClick={() => {
                setWit("Noted. Recognition is not the same as scars.");
                setOnboard(3);
              }}
              className="mt-3 h-8 rounded-full bg-fg px-3 text-[12px] text-bg"
            >
              Next
            </button>
          </>
        ) : onboard === 3 ? (
          <>
            {wit ? <p className="text-[12px] text-muted">{wit}</p> : null}
            <p className="mt-3 text-[14px] font-medium">Which have you actually used?</p>
            <div className="mt-2 flex flex-wrap gap-1">
              {PLATS.map((p) => (
                <button
                  key={p}
                  type="button"
                  onClick={() => setUsed((h) => (h.includes(p) ? h.filter((x) => x !== p) : [...h, p]))}
                  className={cn("chip-lens h-7 rounded-full px-2.5 text-[11px]", used.includes(p) && "chip-lens-on")}
                >
                  {p}
                </button>
              ))}
            </div>
            <button
              type="button"
              onClick={() => {
                setWit("The Desk will try not to waste those hours.");
                setOnboard(4);
              }}
              className="mt-3 h-8 rounded-full bg-fg px-3 text-[12px] text-bg"
            >
              Next
            </button>
          </>
        ) : (
          <>
            {wit ? <p className="text-[12px] text-muted">{wit}</p> : null}
            <p className="mt-3 text-[14px] font-medium">What kinds of apps interest you?</p>
            <div className="mt-2 flex flex-wrap gap-1">
              {CATS.map((p) => (
                <button
                  key={p}
                  type="button"
                  onClick={() => setCats((h) => (h.includes(p) ? h.filter((x) => x !== p) : [...h, p]))}
                  className={cn("chip-lens h-7 rounded-full px-2.5 text-[11px]", cats.includes(p) && "chip-lens-on")}
                >
                  {p}
                </button>
              ))}
            </div>
            <button
              type="button"
              onClick={() => {
                setFlintOnboarded();
                setReadyOnboard(true);
              }}
              className="vibe-grad mt-4 h-10 w-full rounded-full text-[13px] font-semibold text-black"
            >
              Open the cubicle
            </button>
          </>
        )}
        {learn ? (
          <div className="fixed inset-0 z-40 grid place-items-center bg-black/70 p-4" onClick={() => setLearn(false)}>
            <div className="max-h-[70dvh] overflow-auto rounded-2xl bg-bg p-4 text-[13px] text-muted ring-1 ring-border" onClick={(e) => e.stopPropagation()}>
              <p className="text-[14px] font-semibold text-fg">What this is</p>
              <p className="mt-2">A PWA is a website that can install to your home screen and often work offline. Appendix is a yard of those — not an APK store.</p>
              <p className="mt-2">Flints are loyalty coins for sitting with an app and writing a real sentence, reporting a dead link, or filling a hole. You cannot buy stars with them. You can buy a week of eyes.</p>
              <p className="mt-2">The Desk is three chairs. Skip three times a day. Then write.</p>
              <button type="button" onClick={() => setLearn(false)} className="mt-3 text-primary">
                Close
              </button>
            </div>
          </div>
        ) : null}
      </PlayShell>
    );
  }

  if (!openCubicle) {
    return (
      <PlayShell heroTitle="Flints" heroLine="The door is louder than the room.">
        <p className="text-[13px] text-muted">{n} Flints on this device. Community labor is free. Eyes are not.</p>
        <button
          type="button"
          onClick={() => setOpenCubicle(true)}
          className="vibe-grad mt-6 h-14 w-full rounded-full text-[16px] font-semibold text-black"
        >
          Open the cubicle
        </button>
      </PlayShell>
    );
  }

  return (
    <PlayShell heroTitle="Your cubicle" heroLine="Aggressively boring beige. The monitor is the interesting part.">
      <div className="relative overflow-hidden rounded-2xl ring-1 ring-border">
        <img src="/heroes/cubicle.jpg" alt="" className="h-64 w-full object-cover" />
        <button
          type="button"
          onClick={() => setMonitor("how")}
          className="absolute top-[28%] left-[38%] h-[22%] w-[32%] rounded-sm bg-black/30 ring-1 ring-white/40"
          aria-label="Appendix Windows"
        />
        <p className="absolute top-2 left-3 rounded bg-black/50 px-2 py-0.5 font-display text-[13px]">{n} Flints</p>
      </div>
      <p className="mt-2 text-[10px] text-muted">Tap the monitor for Appendix Windows. Folders on the desk are the three chairs.</p>

      <ol className="mt-3 grid grid-cols-3 gap-2">
        {tickets.map((app, i) => (
          <li key={app.id} className="folder-clip rounded-md bg-[#e8d5a3] p-2 pt-4 text-[#3a2a12] ring-1 ring-[#c4ae70]">
            <p className="text-[9px] tracking-wide uppercase">{i < 2 ? "Sponsored" : "Random"}</p>
            <Link
              to="/app/$id"
              params={{ id: app.id }}
              search={{ desk: "1" }}
              onClick={() => markDeskOpen(app.id)}
              className="mt-1 block"
            >
              <AppIcon name={app.name} iconUrl={app.iconUrl} className="size-9" />
              <p className="mt-1 truncate text-[10px] font-medium">{app.name}</p>
            </Link>
            <button type="button" onClick={() => skip(app.id)} disabled={skips <= 0} className="mt-1 text-[9px] disabled:opacity-40">
              Skip
            </button>
          </li>
        ))}
      </ol>
      <p className="mt-1 text-[10px] text-muted">{skips} skips left today. Resets in 24 hours.</p>
      {note ? <p className="mt-2 text-[12px] text-muted">{note}</p> : null}

      {monitor !== "off" ? (
        <div className="fixed inset-0 z-40 grid place-items-end bg-black/55 p-3 pb-24">
          <div className="max-h-[70dvh] w-full max-w-3xl overflow-auto rounded-2xl bg-bg p-4 ring-1 ring-border">
            <p className="mb-2 font-display text-[12px] tracking-wide">Appendix Windows</p>
            <div className="flex gap-1 overflow-x-auto pb-2">
              {([
                ["how", "How Flints work"],
                ["redeem", "Redemption"],
                ["dev", "Developer"],
                ["price", "Pricing"],
              ] as const).map(([id, label]) => (
                <button
                  key={id}
                  type="button"
                  onClick={() => setMonitor(id)}
                  className={cn("chip-lens h-7 rounded-full px-3 text-[11px]", monitor === id && "chip-lens-on")}
                >
                  {label}
                </button>
              ))}
              <button type="button" onClick={() => setMonitor("off")} className="ml-auto text-[11px] text-muted">
                Close
              </button>
            </div>
            {monitor === "how" ? (
              <div className="space-y-2 text-[12px] text-muted">
                <p>Open a ticket, actually use the PWA (~2 minutes of real poking), then a 1–5 star rating plus a public review and a private critique (150 characters each). That earns 1 Flint. Stars without sentences: 0. Opening the tab: 0. Five stars are not required — a 1 is as honest as a 5.</p>
                <p>Deeper work can earn bonus Flints. We don’t publish the exact line so people don’t pad.</p>
                <p>Verified broken link or wrong metadata: +2. Screenshots and walkthroughs pay after they land. If we haven’t looked in 24–48 hours, you still get the points. At 72 hours the media publishes anyway — the yard corrects itself.</p>
              </div>
            ) : monitor === "redeem" ? (
              <div className="text-[12px] text-muted">
                <p>
                  {FLINT_PROMO_COST} Flints = one week of sponsored eyes for one of your apps. Configurable later.
                  Buying visibility, not a badge.
                </p>
                <button
                  type="button"
                  onClick={redeem}
                  className="mt-3 h-9 rounded-full bg-get px-4 text-[12px] font-semibold text-get-fg"
                >
                  Redeem a sponsored week
                </button>
              </div>
            ) : monitor === "dev" ? (
              <div className="text-[12px] text-muted">
                <p>File a PWA for free. Claim one that’s already indexed. Enrich the holes. That’s how amateurs become a listing with a name on it.</p>
                <Link to="/studio" className="mt-3 inline-flex h-9 items-center rounded-full bg-fg px-4 text-[12px] text-bg">
                  Become a developer
                </Link>
              </div>
            ) : (
              <div className="text-[12px] text-muted">
                <p>$4.99/mo — Home sponsored tile. $19.99/mo — Desk pool. Higher volume exists later. Paying never buys stars.</p>
                <Link to="/advertise" className="mt-3 inline-block text-primary">
                  Sponsor the yard
                </Link>
              </div>
            )}
          </div>
        </div>
      ) : null}
    </PlayShell>
  );
}
