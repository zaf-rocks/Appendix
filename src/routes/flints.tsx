import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { PlayShell } from "@/components/play-shell";
import { AppIcon } from "@/components/app-icon";
import { isUp } from "@/lib/catalog";
import { listStore } from "@/lib/store-api";
import {
  binApp,
  binIds,
  deskTickets,
  doneIds,
  flintBalance,
  flintOnboarded,
  inboxIds,
  markDeskOpen,
  outboxItems,
  redeemPromo,
  restoreBin,
  setFlintOnboarded,
  skipDesk,
  skipState,
  skippedIds,
} from "@/lib/yard";
import type { AppEntry } from "@/lib/catalog";
import { useLens } from "@/lib/lens";
import { throughLens } from "@/lib/provenance";
import { useCurrentUserState } from "@/lib/auth/use-current-user";
import { myFlintBalance, startSponsor } from "@/lib/well-api";
import { specTri, specVars } from "@/lib/spectrum";
import { cn } from "@/lib/cn";

const PLATS = ["Grok", "Lovable", "Bolt", "v0", "Replit", "Bubble", "Glide", "Softr", "Emergent", "ChatGPT", "Gemini", "Cursor"];
const CATS = ["Games", "Tools", "Music", "Photo", "Business", "Education", "Social", "Health"];

function SpecBtn({
  i,
  on,
  children,
  onClick,
}: {
  i: number;
  on?: boolean;
  children: React.ReactNode;
  onClick: () => void;
}) {
  const [c1, c2, c3] = specTri(i);
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn("spec-pick", on && "spec-pick-on")}
      style={{ ["--c1" as string]: c1, ["--c2" as string]: c2, ["--c3" as string]: c3 }}
    >
      <span className="spec-pick-face">{children}</span>
    </button>
  );
}

const RACKS = [
  { id: "inbox", label: "Inbox" },
  { id: "random", label: "Index" },
  { id: "paid", label: "Paid" },
  { id: "flint", label: "Flint" },
  { id: "skipped", label: "Skipped" },
  { id: "done", label: "Done" },
] as const;

type RackId = (typeof RACKS)[number]["id"];

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
  const [onboard, setOnboard] = useState(0);
  const [heard, setHeard] = useState<string[]>([]);
  const [used, setUsed] = useState<string[]>([]);
  const [other, setOther] = useState("");
  const [cats, setCats] = useState<string[]>([]);
  const [readyOnboard, setReadyOnboard] = useState<boolean | null>(null);
  const [inbox, setInbox] = useState<string[]>([]);
  const [outbox, setOutbox] = useState<{ id: string; flints: number }[]>([]);
  const [bin, setBin] = useState<string[]>([]);
  const [skipped, setSkipped] = useState<string[]>([]);
  const [done, setDone] = useState<string[]>([]);
  const [screen, setScreen] = useState<RackId | null>(null);

  const live = useMemo(() => catalog.filter(isUp), [catalog]);

  useEffect(() => {
    setN(flintBalance());
    setTickets(deskTickets(live.length ? live : catalog));
    setSkips(skipState().left);
    setReadyOnboard(flintOnboarded());
    setInbox(inboxIds());
    setOutbox(outboxItems());
    setBin(binIds());
    setSkipped(skippedIds());
    setDone(doneIds());
    if (user) {
      void myFlintBalance()
        .then((r) => setN(r.n || flintBalance()))
        .catch(() => setN(flintBalance()));
    }
  }, [catalog, live, user]);

  function skip(id: string) {
    const r = skipDesk(id, live.length ? live : catalog);
    setTickets(r.tickets);
    setSkips(skipState().left);
    setSkipped(skippedIds());
    setNote(r.ok ? null : r.reason || null);
  }

  function redeem() {
    const r = redeemPromo();
    setN(flintBalance());
    if (r.ok) void startSponsor({ data: { listingId: "yard", kind: "flint", days: 7 } });
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
          Flints are how the yard pays people who actually sit with an app, write a real sentence,
          and help the catalog get less wrong. They unlock free promotion — eyes, not stars.
        </p>
        <p className="mt-2 text-[12px] text-muted">Sign in to open your cubicle, earn, and redeem. Identity works too.</p>
        <Link
          to="/login"
          className="mt-4 inline-flex h-10 items-center rounded-full bg-get px-4 text-[13px] font-semibold text-get-fg"
        >
          Sign in or create account
        </Link>
      </PlayShell>
    );
  }

  if (user && readyOnboard === null) {
    return <PlayShell heroTitle="Flints" heroLine=""><span /></PlayShell>;
  }

  if (user && readyOnboard === false) {
    return (
      <PlayShell heroTitle="Flints" heroLine="Four questions. Then the cubicle.">
        {onboard === 0 ? (
          <>
            <p className="text-[14px] font-medium">Are you familiar with vibe coding?</p>
            <div className="mt-3 flex flex-wrap gap-1">
              {["Yes", "I've heard of it", "No"].map((l, i) => (
                <SpecBtn key={l} i={i} onClick={() => setOnboard(1)}>
                  {l}
                </SpecBtn>
              ))}
            </div>
          </>
        ) : onboard === 1 ? (
          <>
            <p className="text-[14px] font-medium">Which builders have you heard of?</p>
            <div className="mt-2 flex flex-wrap gap-1">
              {PLATS.map((p, i) => (
                <SpecBtn key={p} i={i + 3} on={heard.includes(p)} onClick={() => setHeard((h) => (h.includes(p) ? h.filter((x) => x !== p) : [...h, p]))}>
                  {p}
                </SpecBtn>
              ))}
            </div>
            <input
              value={other}
              onChange={(e) => setOther(e.target.value)}
              placeholder="Other, comma-separated"
              className="mt-2 h-8 w-full rounded-md border border-border bg-surface px-2 text-[12px]"
            />
            <button type="button" onClick={() => setOnboard(2)} className="mt-3 h-8 rounded-full bg-fg px-3 text-[12px] text-bg">
              Next
            </button>
          </>
        ) : onboard === 2 ? (
          <>
            <p className="text-[14px] font-medium">Which have you actually used?</p>
            <div className="mt-2 flex flex-wrap gap-1">
              {PLATS.map((p, i) => (
                <SpecBtn key={p} i={i + 16} on={used.includes(p)} onClick={() => setUsed((h) => (h.includes(p) ? h.filter((x) => x !== p) : [...h, p]))}>
                  {p}
                </SpecBtn>
              ))}
            </div>
            <button type="button" onClick={() => setOnboard(3)} className="mt-3 h-8 rounded-full bg-fg px-3 text-[12px] text-bg">
              Next
            </button>
          </>
        ) : (
          <>
            <p className="text-[14px] font-medium">What kinds of apps interest you?</p>
            <div className="mt-2 flex flex-wrap gap-1">
              {CATS.map((p, i) => (
                <SpecBtn key={p} i={i + 29} on={cats.includes(p)} onClick={() => setCats((h) => (h.includes(p) ? h.filter((x) => x !== p) : [...h, p]))}>
                  {p}
                </SpecBtn>
              ))}
            </div>
            <button
              type="button"
              onClick={() => {
                setFlintOnboarded();
                setReadyOnboard(true);
              }}
              className="mt-3 h-8 rounded-full bg-get px-3 text-[12px] font-semibold text-get-fg"
            >
              Open the cubicle
            </button>
          </>
        )}
      </PlayShell>
    );
  }

  return (
    <PlayShell heroTitle="Your cubicle" heroLine="Six racks on the wall. The screen is where the work happens.">
      <div className="cubicle-scene">
        <img src="/heroes/cubicle-live.jpg" alt="" />
        <div className="cubicle-racks">
          {RACKS.map((rack) => (
            <button key={rack.id} type="button" className="cubicle-rack" onClick={() => setScreen(rack.id)}>
              <span>{rack.label}</span>
            </button>
          ))}
        </div>
        <button type="button" className="cubicle-screen-hit" aria-label="Open the computer" onClick={() => setScreen(screen || "random")} />
        <p className="cubicle-note">About a minute is a Flint. A real note is worth more.</p>
        <p className="absolute top-2 left-3 text-[12px] font-semibold text-white drop-shadow">{n} Flints</p>
      </div>
      <p className="mt-2 text-[10px] text-muted">
        Tap a folder. That pile opens on the screen. {skips} skips left today.
      </p>
      {bin.length ? (
        <div className="mt-2 text-[11px]">
          <p className="text-[10px] tracking-wide text-muted uppercase">Bin</p>
          {bin.map((id) => (
            <p key={id} className="mt-1">
              {catalog.find((a) => a.id === id)?.name || id}{" "}
              <button type="button" className="underline" onClick={() => { restoreBin(id); setInbox(inboxIds()); setBin(binIds()); }}>
                Back to inbox
              </button>{" "}
              <button type="button" className="underline text-muted" onClick={() => { binApp(id, true); setBin(binIds()); }}>
                Never again
              </button>
            </p>
          ))}
        </div>
      ) : null}
      {note ? <p className="mt-2 text-[12px] text-muted">{note}</p> : null}

      {screen ? (
        <DeskScreen
          rack={screen}
          flints={n}
          catalog={catalog}
          inbox={inbox}
          tickets={tickets}
          skipped={skipped}
          done={[...new Set([...done, ...outbox.map((o) => o.id)])]}
          paid={catalog.filter((a) => a.sponsored && a.paid)}
          onPick={setScreen}
          onClose={() => setScreen(null)}
          onSkip={skip}
          onRedeem={redeem}
          onBin={(id) => {
            binApp(id, false);
            setInbox(inboxIds());
            setBin(binIds());
          }}
        />
      ) : null}
    </PlayShell>
  );
}

function pileApps(rack: RackId, catalog: AppEntry[], inbox: string[], tickets: AppEntry[], skipped: string[], done: string[], paid: AppEntry[]) {
  const byId = (ids: string[]) => ids.map((id) => catalog.find((a) => a.id === id)).filter((a): a is AppEntry => Boolean(a));
  if (rack === "inbox") return byId(inbox);
  if (rack === "random") return tickets;
  if (rack === "paid") return paid;
  if (rack === "flint") return [];
  if (rack === "skipped") return byId(skipped);
  return byId(done);
}

function DeskScreen({
  rack,
  flints,
  catalog,
  inbox,
  tickets,
  skipped,
  done,
  paid,
  onPick,
  onClose,
  onSkip,
  onRedeem,
  onBin,
}: {
  rack: RackId;
  flints: number;
  catalog: AppEntry[];
  inbox: string[];
  tickets: AppEntry[];
  skipped: string[];
  done: string[];
  paid: AppEntry[];
  onPick: (id: RackId) => void;
  onClose: () => void;
  onSkip: (id: string) => void;
  onRedeem: () => void;
  onBin: (id: string) => void;
}) {
  const apps = pileApps(rack, catalog, inbox, tickets, skipped, done, paid);
  const blurb =
    rack === "inbox"
      ? "Apps you sent yourself."
      : rack === "random"
        ? "Three from the index. These are the ones asking for a sitting."
        : rack === "paid"
          ? "Paid sponsors. None until someone actually pays."
          : rack === "flint"
            ? "Flint-redeemed weeks. None yet."
            : rack === "skipped"
              ? "Set aside. They can come back."
              : "Reviews you already finished.";
  return (
    <div className="desk-os">
      <div className="desk-os-bezel">
        <div className="flex items-center gap-2">
          <p className="text-[11px] tracking-wide text-white/50 uppercase">Desk</p>
          <p className="ml-auto text-[11px] text-white/70">{flints} Flints</p>
          <button type="button" onClick={onClose} className="text-[11px] text-white/60">
            Close
          </button>
        </div>
        <div className="mt-2 flex flex-wrap gap-1">
          {RACKS.map((r, i) => (
            <button
              key={r.id}
              type="button"
              onClick={() => onPick(r.id)}
              className={cn("spec-pick", rack === r.id && "spec-pick-on")}
              style={specVars(i + 40)}
            >
              <span className="spec-pick-face">{r.label}</span>
            </button>
          ))}
        </div>
        <p className="mt-3 text-[13px] font-medium">{RACKS.find((r) => r.id === rack)?.label}</p>
        <p className="text-[11px] text-white/55">{blurb}</p>
        {apps.length === 0 ? <p className="mt-3 text-[12px] text-white/45">This rack is empty.</p> : null}
        <ul>
          {apps.map((app) => (
            <li key={app.id} className="desk-os-row">
              <AppIcon name={app.name} iconUrl={app.iconUrl} className="size-6 text-[9px]" />
              <span className="min-w-0 flex-1 truncate">{app.name}</span>
              <Link
                to="/app/$id"
                params={{ id: app.id }}
                search={{ desk: tickets.some((t) => t.id === app.id) ? "1" : undefined }}
                onClick={() => markDeskOpen(app.id)}
                className="text-[11px] text-white underline"
              >
                Open
              </Link>
              {rack === "random" ? (
                <button type="button" className="text-[11px] text-white/50" onClick={() => onSkip(app.id)}>
                  Skip
                </button>
              ) : null}
              {rack === "inbox" ? (
                <button type="button" className="text-[11px] text-white/50" onClick={() => onBin(app.id)}>
                  Bin
                </button>
              ) : null}
            </li>
          ))}
        </ul>
        <div className="mt-3 flex flex-wrap gap-3 text-[11px] text-white/55">
          <button type="button" onClick={onRedeem}>Redeem a week</button>
          <Link to="/studio">File an app</Link>
          <Link to="/contact">Contact</Link>
          <Link to="/advertise">Pricing</Link>
        </div>
      </div>
    </div>
  );
}
