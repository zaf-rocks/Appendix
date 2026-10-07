import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { PlayShell } from "@/components/play-shell";
import { blockTag, strikeWeekReviews, takeFlints, wellAct, wellBoard } from "@/lib/well-api";

export const Route = createFileRoute("/well")({
  loader: async () => {
    try {
      return await wellBoard();
    } catch {
      return null;
    }
  },
  component: Well,
});

function Well() {
  const initial = Route.useLoaderData();
  const [board, setBoard] = useState(initial);
  const [busy, setBusy] = useState<string | null>(null);
  const [adjust, setAdjust] = useState<Record<string, string>>({});

  async function act(listingId: string, action: "shelf" | "hide" | "dead" | "restore" | "purge" | "dismiss" | "hold") {
    setBusy(`${listingId}:${action}`);
    try {
      await wellAct({ data: { listingId, action } });
      setBoard(await wellBoard());
    } catch {
      setBoard(null);
    }
    setBusy(null);
  }

  if (!board) {
    return (
      <PlayShell heroTitle="Admin dashboard" heroLine="">
        <p className="text-[12px] text-muted">Nothing in this aisle yet.</p>
      </PlayShell>
    );
  }

  const { pulse, reports, reviews, pending, dead, hidden, holds, analytics, suggestions, sponsors, rareTags, roster } = board;
  const starMax = Math.max(1, ...analytics.stars.map((s) => s.n));
  const dayMax = Math.max(1, ...analytics.reportDays.map((d) => d.n));

  return (
    <PlayShell heroTitle="Admin dashboard" heroLine="Reports, holds, sponsors.">
      <p className="text-[10px] tracking-wide text-muted uppercase">Pulse</p>
      <dl className="mt-1 grid grid-cols-2 gap-x-3 gap-y-1 text-[12px]">
        <dt className="text-muted">Apps</dt>
        <dd>{pulse.apps}</dd>
        <dt className="text-muted">Vibe / all</dt>
        <dd>
          {pulse.vibe} / {pulse.all}
        </dd>
        <dt className="text-muted">Reviews</dt>
        <dd>{pulse.reviews}</dd>
        <dt className="text-muted">Broken reports</dt>
        <dd>{pulse.reports}</dd>
        <dt className="text-muted">Pending</dt>
        <dd>{pulse.pending}</dd>
        <dt className="text-muted">Dead</dt>
        <dd>{pulse.dead}</dd>
        <dt className="text-muted">Hidden</dt>
        <dd>{pulse.hidden}</dd>
        <dt className="text-muted">Beta</dt>
        <dd>{pulse.beta}</dd>
        <dt className="text-muted">Claims</dt>
        <dd>{pulse.claims}</dd>
        <dt className="text-muted">Flints issued</dt>
        <dd>{pulse.flintsIssued}</dd>
        <dt className="text-muted">Sponsored paid</dt>
        <dd>{pulse.sponsorsPaid}</dd>
        <dt className="text-muted">Sponsored flint</dt>
        <dd>{pulse.sponsorsFlint}</dd>
        <dt className="text-muted">Sponsor 7-day</dt>
        <dd>{pulse.sponsors7}</dd>
        <dt className="text-muted">Sponsor 30-day</dt>
        <dd>{pulse.sponsors30}</dd>
        <dt className="text-muted">Suggestions</dt>
        <dd>{pulse.suggestions}</dd>
      </dl>

      <p className="mt-5 text-[10px] tracking-wide text-muted uppercase">Habits · last 14 days</p>
      <p className="mt-1 text-[11px] text-muted">Broken-link reports by day. Opens show once people actually launch apps from the yard.</p>
      {analytics.reportDays.length ? (
        <div className="mt-2 flex h-16 items-end gap-1">
          {analytics.reportDays.map((d) => (
            <div key={d.day} className="flex-1 bg-primary/70" style={{ height: `${Math.max(8, (d.n / dayMax) * 100)}%` }} title={`${d.day}: ${d.n}`} />
          ))}
        </div>
      ) : (
        <p className="mt-1 text-[12px] text-muted">No reports in the last two weeks.</p>
      )}

      <p className="mt-4 text-[10px] tracking-wide text-muted uppercase">Stars people actually left</p>
      <ul className="mt-1 space-y-1">
        {analytics.stars.map((s) => (
          <li key={s.star} className="flex items-center gap-2 text-[11px]">
            <span className="w-6 text-muted">{s.star}★</span>
            <span className="h-1.5 flex-1 overflow-hidden rounded-full bg-raised">
              <span className="block h-full bg-cat-amber" style={{ width: `${(s.n / starMax) * 100}%` }} />
            </span>
            <span className="w-6 text-right text-muted">{s.n}</span>
          </li>
        ))}
      </ul>

      <div className="mt-4 grid grid-cols-2 gap-4">
        <div>
          <p className="text-[10px] tracking-wide text-muted uppercase">Factories</p>
          <ul className="mt-1 space-y-0.5 text-[11px]">
            {analytics.platforms.map((p) => (
              <li key={p.name} className="flex justify-between gap-2">
                <span className="truncate">{p.name}</span>
                <span className="text-muted">{p.n}</span>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <p className="text-[10px] tracking-wide text-muted uppercase">Aisles</p>
          <ul className="mt-1 space-y-0.5 text-[11px]">
            {analytics.genres.map((g) => (
              <li key={g.id} className="flex justify-between gap-2">
                <span className="truncate">{g.label}</span>
                <span className="text-muted">{g.n}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <p className="mt-4 text-[10px] tracking-wide text-muted uppercase">Opened from the yard</p>
      {analytics.opens.length === 0 ? (
        <p className="mt-1 text-[12px] text-muted">No launches recorded yet. They start the next time someone hits Open.</p>
      ) : (
        <ul className="mt-1 space-y-0.5 text-[11px]">
          {analytics.opens.map((o) => (
            <li key={o.listingId} className="flex justify-between gap-2">
              <Link to="/app/$id" params={{ id: o.listingId }} search={{ desk: undefined }} className="truncate">
                {o.name}
              </Link>
              <span className="text-muted">{o.n}</span>
            </li>
          ))}
        </ul>
      )}

      <p className="mt-5 text-[10px] tracking-wide text-muted uppercase">Sponsors</p>
      <div className="mt-1 grid grid-cols-3 gap-2 text-[11px]">
        <div>
          <p className="text-muted">1-week paid</p>
          {sponsors.filter((s) => s.kind === "paid" && s.days === 7).map((s) => (
            <p key={`p7-${s.listingId}`} className="truncate">{s.name}</p>
          ))}
        </div>
        <div>
          <p className="text-muted">1-week Flint</p>
          {sponsors.filter((s) => s.kind === "flint" && s.days === 7).map((s) => (
            <p key={`f7-${s.listingId}`} className="truncate">{s.name}</p>
          ))}
        </div>
        <div>
          <p className="text-muted">30-day paid</p>
          {sponsors.filter((s) => s.kind === "paid" && s.days === 30).map((s) => (
            <p key={`p30-${s.listingId}`} className="truncate">{s.name}</p>
          ))}
        </div>
      </div>

      <p className="mt-5 text-[10px] tracking-wide text-muted uppercase">Hold · 30 days</p>
      {holds.length === 0 ? (
        <p className="mt-1 text-[12px] text-muted">Nothing on the back burner.</p>
      ) : (
        <ul className="mt-1 space-y-2">
          {holds.map((r) => (
            <li key={r.listingId} className="rounded-md bg-surface p-2 text-[12px] ring-1 ring-border">
              <p className="font-medium">{r.name}</p>
              <p className="text-muted">Until {r.until?.slice(0, 10)}</p>
              <div className="mt-1 flex gap-3">
                <button type="button" className="underline" disabled={busy !== null} onClick={() => act(r.listingId, "restore")}>
                  Put back
                </button>
                <button type="button" className="underline text-down" disabled={busy !== null} onClick={() => act(r.listingId, "purge")}>
                  Delete now
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}

      <p className="mt-5 text-[10px] tracking-wide text-muted uppercase">Rare tags</p>
      {rareTags.length === 0 ? (
        <p className="mt-1 text-[12px] text-muted">No custom tags yet.</p>
      ) : (
        <ul className="mt-1 space-y-1 text-[12px]">
          {rareTags.map((t) => (
            <li key={t.tag} className="flex items-center justify-between gap-2">
              <span>
                {t.tag} · {t.n}
              </span>
              <button
                type="button"
                className="underline text-down"
                onClick={() => {
                  void blockTag({ data: { tag: t.tag } }).then(() => wellBoard().then(setBoard));
                }}
              >
                Delete
              </button>
            </li>
          ))}
        </ul>
      )}

      <p className="mt-5 text-[10px] tracking-wide text-muted uppercase">Flint roster</p>
      {roster.length === 0 ? (
        <p className="mt-1 text-[12px] text-muted">No account balances yet.</p>
      ) : (
        <ul className="mt-1 space-y-1 text-[12px]">
          {roster.map((r) => (
            <li key={r.userId} className="flex items-center justify-between gap-2">
              <span className="truncate">{r.userId.slice(0, 8)} · {r.n}</span>
              <span className="flex items-center gap-1">
                <input
                  value={adjust[r.userId] || ""}
                  onChange={(e) => setAdjust((cur) => ({ ...cur, [r.userId]: e.target.value }))}
                  inputMode="numeric"
                  className="h-6 w-12 rounded border border-border bg-bg px-1 text-[11px]"
                />
                <button
                  type="button"
                  className="underline text-muted"
                  onClick={() => {
                    const amount = Number(adjust[r.userId]);
                    if (!Number.isInteger(amount) || amount < 1) return;
                    void takeFlints({ data: { userId: r.userId, amount } }).then(() => wellBoard().then(setBoard));
                  }}
                >
                  Adjust
                </button>
              </span>
            </li>
          ))}
        </ul>
      )}

      <p className="mt-5 text-[10px] tracking-wide text-muted uppercase">Suggestion box</p>
      {suggestions.length === 0 ? (
        <p className="mt-1 text-[12px] text-muted">Empty. Users drop notes on Contact.</p>
      ) : (
        <ul className="mt-1 space-y-2">
          {suggestions.map((s) => (
            <li key={s.id} className="rounded-md bg-surface p-2 text-[12px] ring-1 ring-border">
              <p className="text-[10px] tracking-wide text-muted uppercase">
                {s.kind}
                {s.email ? ` · ${s.email}` : ""}
              </p>
              <p className="mt-0.5">{s.body}</p>
            </li>
          ))}
        </ul>
      )}

      <p className="mt-5 text-[10px] tracking-wide text-muted uppercase">Dead links</p>
      {dead.length === 0 ? (
        <p className="mt-1 text-[12px] text-muted">Nothing marked dead.</p>
      ) : (
        <ul className="mt-1 space-y-2">
          {dead.map((r) => (
            <li key={r.listingId} className="rounded-md bg-surface p-2 text-[12px] ring-1 ring-border">
              <Link to="/app/$id" params={{ id: r.listingId }} search={{ desk: undefined }} className="font-medium">
                {r.name}
              </Link>
              {r.n ? <span className="text-muted"> · {r.n} reports</span> : null}
              <div className="mt-1 flex flex-wrap gap-3">
                <button type="button" className="underline" disabled={busy !== null} onClick={() => act(r.listingId, "restore")}>
                  restore
                </button>
                <button type="button" className="underline text-down" disabled={busy !== null} onClick={() => act(r.listingId, "purge")}>
                  delete from yard
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}

      <p className="mt-5 text-[10px] tracking-wide text-muted uppercase">Reports</p>
      {reports.length === 0 ? (
        <p className="mt-1 text-[12px] text-muted">No broken-link reports.</p>
      ) : (
        <ul className="mt-1 space-y-2">
          {reports.map((r) => (
            <li key={r.listingId} className="rounded-md bg-surface p-2 text-[12px] ring-1 ring-border">
              <Link to="/app/$id" params={{ id: r.listingId }} search={{ desk: undefined }} className="font-medium">
                {r.name}
              </Link>
              <span className="text-muted"> · {r.n} reports</span>
              <div className="mt-1 flex flex-wrap gap-3">
                <button type="button" className="underline text-muted" disabled={busy !== null} onClick={() => act(r.listingId, "dismiss")}>
                  Dismiss
                </button>
                <button type="button" className="underline text-muted" disabled={busy !== null} onClick={() => act(r.listingId, "hold")}>
                  Hold 30 days
                </button>
                <button type="button" className="underline text-down" disabled={busy !== null} onClick={() => act(r.listingId, "purge")}>
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}

      {hidden.length ? (
        <>
          <p className="mt-5 text-[10px] tracking-wide text-muted uppercase">Hidden</p>
          <ul className="mt-1 space-y-2">
            {hidden.map((r) => (
              <li key={r.listingId} className="rounded-md bg-surface p-2 text-[12px] ring-1 ring-border">
                <p className="font-medium">{r.name}</p>
                <div className="mt-1 flex gap-3">
                  <button type="button" className="underline" disabled={busy !== null} onClick={() => act(r.listingId, "restore")}>
                    restore
                  </button>
                  <button type="button" className="underline text-down" disabled={busy !== null} onClick={() => act(r.listingId, "purge")}>
                    delete from yard
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </>
      ) : null}

      <p className="mt-5 text-[10px] tracking-wide text-muted uppercase">Reviews</p>
      {reviews.length === 0 ? (
        <p className="mt-1 text-[12px] text-muted">No reviews yet.</p>
      ) : (
        <ul className="mt-1 space-y-2">
          {reviews.map((r) => (
            <li key={r.id} className="rounded-md bg-surface p-2 text-[12px] ring-1 ring-border">
              <Link to="/app/$id" params={{ id: r.listingId }} search={{ desk: undefined }} className="font-medium">
                {r.name}
              </Link>
              <span className="text-muted"> · {r.rating}/5</span>
              {r.body ? <p className="mt-0.5">{r.body}</p> : null}
              <button
                type="button"
                className="mt-1 underline text-muted"
                onClick={() => {
                  void strikeWeekReviews({ data: { listingId: r.listingId } }).then(() => wellBoard().then(setBoard));
                }}
              >
                Strike this week’s reviews
              </button>
            </li>
          ))}
        </ul>
      )}

      <p className="mt-5 text-[10px] tracking-wide text-muted uppercase">Approvals</p>
      {pending.length === 0 ? (
        <p className="mt-1 text-[12px] text-muted">Queue empty.</p>
      ) : (
        <ul className="mt-1 space-y-2">
          {pending.map((r) => (
            <li key={r.id} className="rounded-md bg-surface p-2 text-[12px] ring-1 ring-border">
              <p className="font-medium">{r.name}</p>
              <p className="text-muted">{r.tagline}</p>
              <p className="truncate text-[11px] text-muted">{r.url}</p>
              <div className="mt-1 flex gap-2">
                <button type="button" className="underline" disabled={busy !== null} onClick={() => act(r.id, "shelf")}>
                  shelf
                </button>
                <button type="button" className="underline text-muted" disabled={busy !== null} onClick={() => act(r.id, "hide")}>
                  hide
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </PlayShell>
  );
}
