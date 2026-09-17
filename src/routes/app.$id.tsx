import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState, useEffect } from "react";
import { ArrowUpRight, Bookmark, Star, X } from "lucide-react";
import { AppIcon } from "@/components/app-icon";
import { PlayShell } from "@/components/play-shell";
import { Rail } from "@/components/rails";
import { StatusDot } from "@/components/store-shell";
import { AUDIENCES, GENRE_META, SEED, listingStatus } from "@/lib/catalog";
import { listClaims, listReviews, listStore, rateListing, requestClaim } from "@/lib/store-api";
import { useCurrentUserState } from "@/lib/auth/use-current-user";
import { addFlints, bumpOpen, bumpReviewsFiled, deskReady, fourthReviewGate, isReported, isSaved, markDeskDone, markDeskOpen, openCount, reportBroken, replaceDeskSlot, shotUrl, toggleSave } from "@/lib/yard";

export const Route = createFileRoute("/app/$id")({
  validateSearch: (raw: Record<string, unknown>) => ({
    desk: raw.desk === "1" ? "1" : undefined,
  }),
  loader: async ({ params }) => {
    let catalog = SEED;
    try {
      catalog = await listStore();
    } catch {
      catalog = SEED;
    }
    const app = catalog.find((a) => a.id === params.id) ?? SEED.find((a) => a.id === params.id);
    let reviews: Awaited<ReturnType<typeof listReviews>> = [];
    let claim: { listing_id: string; user_id: string } | undefined;
    try {
      reviews = await listReviews({ data: { listingId: params.id } });
      const claims = await listClaims();
      claim = claims.find((c) => c.listing_id === params.id);
    } catch {
      /* listing still renders from seed */
    }
    return { app, catalog, reviews, claim };
  },
  component: AppPage,
});

function AppPage() {
  const { app, catalog, reviews, claim } = Route.useLoaderData();
  const { desk } = Route.useSearch();
  const { user } = useCurrentUserState();
  const [rating, setRating] = useState(5);
  const [body, setBody] = useState("");
  const [note, setNote] = useState<string | null>(null);
  const [claimNote, setClaimNote] = useState<string | null>(null);
  const [claimEmail, setClaimEmail] = useState("");
  const [claimProof, setClaimProof] = useState("");
  const [clicks, setClicks] = useState(0);
  const [ready, setReady] = useState(false);
  const [flag, setFlag] = useState(false);
  const [flagReason, setFlagReason] = useState<string | null>(null);
  const [reported, setReported] = useState(false);
  const [saved, setSaved] = useState(false);
  const [about, setAbout] = useState(false);
  const [gallery, setGallery] = useState<number | null>(null);
  const [priv, setPriv] = useState("");
  const [contribute, setContribute] = useState(false);

  useEffect(() => {
    if (!app) return;
    setClicks(openCount(app.id));
    setReady(deskReady(app.id));
    setReported(isReported(app.id));
    setSaved(isSaved(app.id));
  }, [app]);

  const yardScore = useMemo(() => {
    if (!reviews.length) return null;
    const avg = reviews.reduce((s, r) => s + r.rating, 0) / reviews.length;
    return { avg, n: reviews.length };
  }, [reviews]);

  if (!app) {
    return (
      <PlayShell heroTitle="Missing listing" heroLine="That card is not in the yard yet.">
        <Link to="/" className="text-primary">
          Back to Home
        </Link>
      </PlayShell>
    );
  }

  const liveUrl = app.url;
  const similar = catalog
    .filter((a) => a.id !== app.id && a.genres.some((g) => app.genres.includes(g)))
    .slice(0, 8);
  const more = catalog.filter((a) => a.id !== app.id && a.developer === app.developer);
  const status = listingStatus(app);
  const live = status === "live";
  const id = app.id;
  const crowd = AUDIENCES.find((a) => app.genres.some((g) => a.match.includes(g)));
  const shots = live && shotUrl(liveUrl) ? [shotUrl(liveUrl)!, `${shotUrl(liveUrl)}&h=900`] : [];
  const makerSlug = encodeURIComponent(app.developer);

  async function onClaim(e: React.FormEvent) {
    e.preventDefault();
    try {
      await requestClaim({
        data: { listingId: id, email: claimEmail, proof: claimProof },
      });
      setClaimNote("Request filed. We’ll email you. Nothing is yours until that’s done.");
    } catch {
      setClaimNote("Sign in and send a real contact email. Instant claims are closed.");
    }
  }

  async function onRate(e: React.FormEvent) {
    e.preventDefault();
    if (body.trim().length < 150 || priv.trim().length < 150) {
      setNote("Public review and private critique each need 150 characters. Flints are for notes, not stars alone.");
      return;
    }
    if (desk === "1" && !deskReady(id)) {
      setNote("Open it, use it for a bit, then come back. We time the seat.");
      return;
    }
    if (fourthReviewGate() && !flag) {
      setFlag(true);
      setNote("Fourth review this device. Pick why it might bounce — then send it anyway.");
      return;
    }
    try {
      await rateListing({ data: { listingId: id, rating, body } });
      const n = bumpReviewsFiled();
      let gained = 1;
      if (desk === "1") gained = 1;
      if (body.trim().length + priv.trim().length > 750) gained += 1;
      addFlints(gained);
      if (desk === "1") {
        markDeskDone(id);
        replaceDeskSlot(id, catalog);
      }
      setNote(
        flag
          ? `Flagged (${flagReason || "unspecified"}). Filed anyway. +${gained} Flints. Review #${n}.`
          : `Review filed. +${gained} Flints.`,
      );
      setBody("");
      setFlag(false);
      setFlagReason(null);
    } catch {
      setNote("Sign in to rate.");
    }
  }

  function openPwa() {
    markDeskOpen(id);
    setClicks(bumpOpen(id));
    setTimeout(() => setReady(deskReady(id)), 1000);
    window.open(liveUrl, "_blank", "noreferrer");
  }

  return (
    <PlayShell heroTitle={app.name} heroLine={app.tagline}>
      <div className="flex items-start gap-3">
        <AppIcon name={app.name} iconUrl={app.iconUrl} className="size-14 text-base" />
        <div className="min-w-0 flex-1">
          <h1 className="flex items-center gap-1.5 text-[16px] font-semibold">
            <StatusDot app={app} />
            {app.name}
          </h1>
          <Link to="/maker/$slug" params={{ slug: makerSlug }} className="text-[12px] text-primary">
            {app.developer}
          </Link>
          <p className="mt-0.5 text-[11px] text-muted">
            {app.platform ? `Built with ${app.platform}` : "Builder unknown"}
            {" · "}
            {GENRE_META[app.genres[0]]?.label}
            {crowd ? ` · ${crowd.label}` : ""}
          </p>
          <p className="mt-0.5 flex items-center gap-1 text-[11px] text-muted">
            <Star className="size-3 fill-cat-amber text-cat-amber" />
            Appendix {yardScore ? `${yardScore.avg.toFixed(1)} · ${yardScore.n}` : "no yard reviews yet"}
            {" · "}
            {clicks} opens
          </p>
        </div>
        <button
          type="button"
          aria-label={saved ? "Unsave" : "Save"}
          onClick={() => setSaved(toggleSave(id).includes(id))}
          className="grid size-11 place-items-center"
        >
          <Bookmark className={saved ? "size-5 fill-cat-amber text-cat-amber" : "size-5 text-muted"} />
        </button>
      </div>

      {desk === "1" ? (
        <p className="mt-3 rounded-lg bg-raised px-3 py-2 text-[12px] text-muted">
          Desk ticket. Open the PWA, actually poke around (~2 minutes), come back. A 1–5 rating
          plus public review and private critique. Stars without a note don’t pay Flints.
          {ready ? " Seat time’s good — write." : " Timer’s running once you open it."}
        </p>
      ) : null}

      {live ? (
        <button
          type="button"
          onClick={openPwa}
          className="mt-4 flex h-10 w-full items-center justify-center gap-1 rounded-full bg-get text-[13px] font-semibold text-get-fg"
        >
          Open PWA <ArrowUpRight className="size-3.5" />
        </button>
      ) : status === "soon" ? (
        <div className="mt-4 rounded-lg bg-raised px-3 py-2 text-[12px] text-muted">
          Coming soon / preview. Nothing to open yet.
          <Link to="/beta" className="mt-2 block text-primary">
            Volunteer for beta
          </Link>
        </div>
      ) : (
        <p className="mt-4 rounded-lg bg-raised px-3 py-2 text-[12px] text-muted">
          This listing is real. The link is dead or missing — report it if you can prove it.
        </p>
      )}

      {shots.length ? (
        <div className="-mx-3 mt-4 flex gap-2 overflow-x-auto px-3">
          {shots.map((src, i) => (
            <button key={src} type="button" onClick={() => setGallery(i)} className="shrink-0">
              <img src={src} alt="" className="h-52 w-36 rounded-xl bg-raised object-cover object-top ring-1 ring-border" />
            </button>
          ))}
        </div>
      ) : null}

      {gallery !== null ? (
        <div className="fixed inset-0 z-50 grid place-items-center bg-black/85 p-4" onClick={() => setGallery(null)}>
          <button type="button" className="absolute top-4 right-4 text-white" aria-label="Close">
            <X />
          </button>
          <img
            src={shots[gallery]}
            alt=""
            className="max-h-[80dvh] max-w-full rounded-xl object-contain"
            onClick={(e) => {
              e.stopPropagation();
              setGallery((gallery + 1) % shots.length);
            }}
          />
        </div>
      ) : null}

      <div className="mt-3 flex flex-wrap gap-1">
        {app.genres.slice(0, 2).map((g) => (
          <Chip key={g}>{GENRE_META[g]?.label || g}</Chip>
        ))}
        {app.platform ? <Chip>Built with {app.platform}</Chip> : null}
        <Chip>{app.provenance === "pro" ? "Pro" : "Vibe"}</Chip>
        {app.offline ? <Chip>Works offline</Chip> : null}
        {app.installable ? <Chip>Installable</Chip> : null}
      </div>

      <h2 className="mt-5 text-[11px] font-medium text-muted uppercase">About</h2>
      <p className="mt-1 text-[13px] leading-relaxed text-muted">
        {app.tagline}
      </p>
      <button type="button" onClick={() => setAbout((v) => !v)} className="mt-1 text-[11px] text-primary">
        {about ? "Show less" : "More about this app"}
      </button>
      {about ? (
        <div className="mt-2 space-y-1 text-[12px] text-muted">
          <p>
            {app.description && app.description !== app.tagline
              ? app.description
              : `${app.name} is a ${(GENRE_META[app.genres[0]]?.label || app.genres[0]).toLowerCase()} PWA from ${app.developer}.`}
          </p>
          {app.platform ? <p>Provenance: built with {app.platform}.</p> : <p>Builder not marked yet.</p>}
          <p>Appendix rating stays separate from any external score. External reach not available yet — we will not invent one.</p>
        </div>
      ) : null}

      <button
        type="button"
        onClick={() => setContribute((v) => !v)}
        className="mt-4 h-9 w-full rounded-full bg-raised text-[12px] font-medium ring-1 ring-border"
      >
        Contribute / improve this listing
      </button>
      {contribute ? (
        <ul className="mt-2 space-y-1 text-[12px] text-muted">
          <li>
            <Link to="/app/$id" params={{ id }} search={{ desk: "1" }} className="text-primary">
              Take this review / add to my Desk
            </Link>
          </li>
          <li>Public review and private critique live below.</li>
          <li>Screenshots and walkthroughs: 3 approved shots = 1 Flint. Video ~45s–2min pays more. 24h we still pay; 72h it publishes.</li>
        </ul>
      ) : null}

      <p className="mt-3 text-[11px] text-muted">
        {claim ? (
          "Verified owner on file."
        ) : user ? (
          <form onSubmit={onClaim} className="mt-2 space-y-2 rounded-lg bg-surface p-3 ring-1 ring-border">
          <p className="text-[12px] text-fg">Is this you? Claim this app.</p>
            <p className="text-[11px] text-muted">
              You don’t own it because you tapped a button. Send a contact email and how we can
              tell it’s yours. We write back.
            </p>
            <input
              type="email"
              required
              value={claimEmail}
              onChange={(e) => setClaimEmail(e.target.value)}
              placeholder="you@studio.dev"
              className="h-9 w-full rounded-md border border-border bg-bg px-2"
            />
            <textarea
              required
              minLength={8}
              value={claimProof}
              onChange={(e) => setClaimProof(e.target.value)}
              placeholder="Domain, store listing, or a note we can verify"
              className="h-16 w-full rounded-md border border-border bg-bg p-2"
            />
            <button type="submit" className="h-8 rounded-full bg-primary px-3 text-[12px] text-primary-fg">
              Send for review
            </button>
            {claimNote ? <p>{claimNote}</p> : null}
          </form>
        ) : (
          <>
            Made this?{" "}
            <Link to="/login" className="text-primary">
              Sign in to request a claim
            </Link>
          </>
        )}
      </p>

      <button
        type="button"
        onClick={() => {
          reportBroken(id);
          setReported(true);
        }}
        className="mt-3 text-[11px] text-muted underline"
      >
        {reported ? "Broken-link report filed" : "Report a broken link"}
      </button>

      <h2 className="mt-6 text-[11px] font-medium text-muted uppercase">Yard ratings</h2>
      <p className="text-[11px] text-muted">
        These are reviews left here. The old 4.7 / 250,000 figures were sample wallpaper — gone.
      </p>
      {reviews.length === 0 ? (
        <p className="mt-1 text-[12px] text-muted">No reviews yet.</p>
      ) : (
        <ul className="mt-2 space-y-2">
          {reviews.map((r) => (
            <li key={r.id} className="rounded-md bg-surface p-2 text-[12px] ring-1 ring-border">
              {r.rating}/5 {r.body}
            </li>
          ))}
        </ul>
      )}
      {user ? (
        <form onSubmit={onRate} className="mt-3 space-y-2">
          <div className="flex gap-1">
            {[1, 2, 3, 4, 5].map((n) => (
              <button key={n} type="button" onClick={() => setRating(n)}>
                <Star
                  className={n <= rating ? "size-4 fill-cat-amber text-cat-amber" : "size-4 text-subtle"}
                />
              </button>
            ))}
          </div>
          <textarea
            value={body}
            onChange={(e) => setBody(e.target.value)}
            minLength={24}
            placeholder="What happened when you used it? 150 characters. Public."
            className="h-20 w-full rounded-md border border-border bg-surface p-2 text-[12px]"
          />
          <textarea
            value={priv}
            onChange={(e) => setPriv(e.target.value)}
            minLength={150}
            placeholder="Private note to the developer. 150 characters. Not published."
            className="h-20 w-full rounded-md border border-border bg-surface p-2 text-[12px]"
          />
          {flag ? (
            <div className="space-y-1 rounded-lg bg-raised p-2">
              <p className="text-[11px] text-muted">
                Fourth review always comes back with a reason. Pick one. You can still file.
              </p>
              {["Too short", "Didn’t sit with the PWA", "Sounds like a bot", "Promo / copy-paste", "Something else"].map(
                (r) => (
                  <label key={r} className="flex items-center gap-2 text-[12px]">
                    <input
                      type="radio"
                      name="flag"
                      checked={flagReason === r}
                      onChange={() => setFlagReason(r)}
                    />
                    {r}
                  </label>
                ),
              )}
            </div>
          ) : null}
          <button type="submit" className="h-8 rounded-full bg-primary px-3 text-[12px] text-primary-fg">
            {flag ? "Resubmit anyway" : "Submit review"}
          </button>
          {note ? <p className="text-[11px] text-muted">{note}</p> : null}
        </form>
      ) : (
        <p className="mt-2 text-[12px] text-muted">
          <Link to="/login" className="text-primary">
            Sign in
          </Link>{" "}
          to leave a review and earn Flints.
        </p>
      )}

      {similar.length ? <Rail title="Similar apps" apps={similar} /> : null}
      {more.length ? <Rail title={`More by ${app.developer}`} apps={more} /> : null}
    </PlayShell>
  );
}

function Chip({ children }: { children: React.ReactNode }) {
  return <span className="h-6 rounded-full bg-raised px-2 text-[11px] leading-6 text-muted">{children}</span>;
}
