import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState, useEffect } from "react";
import { ArrowUpRight, Bookmark, Star, X } from "lucide-react";
import { AppIcon } from "@/components/app-icon";
import { PlayShell } from "@/components/play-shell";
import { Rail } from "@/components/rails";
import { StatusDot } from "@/components/store-shell";
import { AUDIENCES, GENRE_META, SEED, listingStatus } from "@/lib/catalog";
import { addListingTags, setBookmark, listClaims, listReviews, listStore, rateListing, requestClaim } from "@/lib/store-api";
import { TAG_CAP, TAG_LIST, cleanTag } from "@/lib/tags";
import { useCurrentUserState } from "@/lib/auth/use-current-user";
import { cn } from "@/lib/cn";
import { specVars } from "@/lib/spectrum";
import { fileLinkReport, awardFlints, recordYardEvent } from "@/lib/well-api";
import { addFlints, bumpOpen, dwellOf, finishOutbox, isReported, isSaved, lookPay, markDepart, noteReturn, openCount, reportBroken, reviewPay, sendToInbox, shotUrl, toggleSave } from "@/lib/yard";

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
  const [rating, setRating] = useState(0);
  const [body, setBody] = useState("");
  const [note, setNote] = useState<string | null>(null);
  const [claimNote, setClaimNote] = useState<string | null>(null);
  const [claimStep, setClaimStep] = useState(0);
  const [claimEmail, setClaimEmail] = useState("");
  const [claimProof, setClaimProof] = useState("");
  const [clicks, setClicks] = useState(0);
  const [dwell, setDwell] = useState(0);
  const [sync, setSync] = useState<string | null>(null);
  const [reported, setReported] = useState(false);
  const [saved, setSaved] = useState(false);
  const [about, setAbout] = useState(false);
  const [gallery, setGallery] = useState<number | null>(null);
  const [priv, setPriv] = useState("");
  const [reviewStep, setReviewStep] = useState(0);
  const [fixStep, setFixStep] = useState(0);
  const [fixKind, setFixKind] = useState("");
  const [fixNote, setFixNote] = useState("");
  const [fixText, setFixText] = useState("");
  const [tagPick, setTagPick] = useState<string[]>([]);
  const [tagFree, setTagFree] = useState("");
  const [tagMsg, setTagMsg] = useState<string | null>(null);

  useEffect(() => {
    if (!app) return;
    setClicks(openCount(app.id));
    setDwell(dwellOf(app.id));
    setReported(isReported(app.id));
    setSaved(isSaved(app.id));
  }, [app]);

  useEffect(() => {
    if (!app) return;
    const id = app.id;
    function back() {
      if (document.visibilityState === "hidden") return;
      const ms = noteReturn(id);
      setDwell(ms);
      if (ms > 0 && ms < 45_000) setSync("Verifying session activity... Not quite. Give it a little longer.");
      else if (ms > 0) setSync("Verifying session activity... Desk sync complete.");
    }
    document.addEventListener("visibilitychange", back);
    window.addEventListener("focus", back);
    return () => {
      document.removeEventListener("visibilitychange", back);
      window.removeEventListener("focus", back);
    };
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
      setClaimNote("Filed. Up to 72 hours before it shows on your developer page. +1 Flint for a real claim.");
      void awardFlints({ data: { amount: 1, reason: `claim:${id}` } }).then((r) => {
        if (!r.already) addFlints(1);
      });
    } catch {
      setClaimNote("Sign in and send a real contact email. Instant claims are closed.");
    }
  }

  async function onRate(e: React.FormEvent) {
    e.preventDefault();
    if (!user) {
      setNote("Sign in before Flints exist.");
      return;
    }
    const ms = dwellOf(id);
    if (!rating || ms < 45_000) {
      setSync("Verifying session activity...");
      setNote("Not quite. That look was a little thin. Stay with it and try again.");
      return;
    }
    const gained = reviewPay(ms, rating, body.trim().length, priv.trim().length, desk === "1");
    let nudge = "";
    if (body.trim().length > 0 && body.trim().length < 75) nudge += " Public note could use a little more detail.";
    if (priv.trim().length > 0 && priv.trim().length < 75) nudge += " The note to the developer could use a little more detail.";
    try {
      const filed = await rateListing({ data: { listingId: id, rating, body, privateBody: priv } });
      if (filed.already) {
        setNote("You already reviewed this one.");
        return;
      }
      addFlints(gained);
      await awardFlints({ data: { amount: Math.max(gained, 1), reason: `review:${id}` } });
      finishOutbox(id, gained);
      setNote(`Review filed. +${gained} Flints.${nudge}`);
      setBody("");
      setReviewStep(4);
    } catch {
      setNote("Sign in to rate.");
    }
  }

  function openPwa() {
    markDepart(id);
    setClicks(bumpOpen(id));
    setSync(null);
    void recordYardEvent({ data: { listingId: id, kind: "open" } });
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
          onClick={() => {
            const next = toggleSave(id);
            setSaved(next.includes(id));
            if (user) void setBookmark({ data: { listingId: id, on: next.includes(id) } });
          }}
          className="grid size-11 place-items-center"
        >
          <Bookmark className={saved ? "size-5 fill-cat-amber text-cat-amber" : "size-5 text-muted"} />
        </button>
      </div>

      {desk === "1" ? (
        <p className="mt-3 rounded-lg bg-raised px-3 py-2 text-[12px] text-muted">
          Desk folder. Open it, come back, then the stars show up.
        </p>
      ) : null}
      {sync ? <p className="mt-2 text-[12px] text-muted">{sync}</p> : null}

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
          <Link key={g} to="/find" search={{ tags: "", genre: g, platform: "" }} className="h-6 rounded-full bg-raised px-2 text-[11px] leading-6 text-muted">
            {GENRE_META[g]?.label || g}
          </Link>
        ))}
        {app.platform ? (
          <Link to="/find" search={{ tags: "", genre: "", platform: app.platform }} className="h-6 rounded-full bg-raised px-2 text-[11px] leading-6 text-muted">
            Built with {app.platform}
          </Link>
        ) : null}
        <Chip>{app.provenance === "pro" ? "Pro" : "Vibe"}</Chip>
        {app.offline ? <Chip>Works offline</Chip> : null}
        {app.installable ? <Chip>Installable</Chip> : null}
      </div>
      <div className="mt-2 flex flex-wrap gap-1">
        {(app.tags || []).map((tag) => (
          <Link key={tag} to="/find" search={{ tags: tag, genre: "", platform: "" }} className="h-6 rounded-full bg-surface px-2 text-[11px] leading-6 ring-1 ring-border">
            {tag}
          </Link>
        ))}
      </div>
      {user ? (
        <form
          className="mt-2 space-y-2"
          onSubmit={(e) => {
            e.preventDefault();
            const custom = tagFree.split(",").map(cleanTag).filter(Boolean);
            const tags = [...tagPick, ...custom].slice(0, TAG_CAP);
            if (!tags.length) return;
            void addListingTags({ data: { listingId: id, tags } }).then((r) => {
              if (r.flints) addFlints(r.flints);
              setTagMsg(r.added ? `Added ${r.added}.${r.flints ? ` +${r.flints} Flint.` : ""}` : "Those are already on it.");
              setTagFree("");
              setTagPick([]);
            });
          }}
        >
          <p className="text-[10px] tracking-wide text-muted uppercase">Add tags</p>
          <div className="flex flex-wrap gap-1">
            {TAG_LIST.filter((t) => !(app.tags || []).some((x) => x.toLowerCase() === t.toLowerCase())).slice(0, 12).map((t, i) => (
              <button
                key={t}
                type="button"
                onClick={() => setTagPick((cur) => (cur.includes(t) ? cur.filter((x) => x !== t) : [...cur, t]))}
                className={cn("spec-pick", tagPick.includes(t) && "spec-pick-on")}
                style={specVars(i + 50)}
              >
                <span className="spec-pick-face">{t}</span>
              </button>
            ))}
          </div>
          <input
            value={tagFree}
            onChange={(e) => setTagFree(e.target.value)}
            placeholder="Your words, commas, emoji"
            className="h-8 w-full rounded-md border border-border bg-bg px-2 text-[12px]"
          />
          <button type="submit" className="h-7 rounded-full bg-primary px-3 text-[11px] text-primary-fg">
            Add
          </button>
          {tagMsg ? <p className="text-[11px] text-muted">{tagMsg}</p> : null}
        </form>
      ) : null}

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

      <div className="mt-4 space-y-2 rounded-lg bg-surface p-3 ring-1 ring-border">
        <p className="text-[12px] text-fg">Contribute</p>
        {!user ? (
          <Link to="/login" className="text-[12px] text-primary">
            Sign in first
          </Link>
        ) : fixStep === 0 ? (
          <div className="flex flex-wrap gap-1">
            {["Wrong info", "Missing summary", "Broken link", "Screenshot note"].map((k) => (
              <button
                key={k}
                type="button"
                onClick={() => {
                  setFixKind(k);
                  setFixStep(1);
                }}
                className="h-8 rounded-full bg-raised px-3 text-[11px]"
              >
                {k}
              </button>
            ))}
          </div>
        ) : (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (fixKind === "Broken link") {
                reportBroken(id);
                setReported(true);
                void fileLinkReport({ data: { listingId: id } });
                void awardFlints({ data: { amount: 2, reason: `dead:${id}` } }).then((r) => {
                  if (!r.already) addFlints(2);
                });
              } else {
                void awardFlints({ data: { amount: 1, reason: `fix:${id}:${fixKind}` } }).then((r) => {
                  if (!r.already) addFlints(1);
                });
              }
              setFixNote("Filed. Thanks.");
              setFixStep(2);
            }}
          >
            <p className="text-[11px] text-muted">{fixKind}</p>
            <textarea
              required
              minLength={12}
              value={fixText}
              onChange={(e) => setFixText(e.target.value)}
              placeholder="What should we know?"
              className="mt-1 h-16 w-full rounded-md border border-border bg-bg p-2 text-[12px]"
            />
            <button type="submit" className="mt-2 h-8 rounded-full bg-primary px-3 text-[12px] text-primary-fg">
              Send
            </button>
          </form>
        )}
        {fixNote ? <p className="text-[11px] text-muted">{fixNote}</p> : null}
      </div>

      <p className="mt-3 text-[11px] text-muted">
        {claim ? (
          "Verified owner on file."
        ) : user && claimStep === 0 ? (
          <button type="button" onClick={() => setClaimStep(1)} className="text-[12px] text-primary">
            This is my app
          </button>
        ) : user && claimStep === 1 ? (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              setClaimStep(2);
            }}
            className="space-y-2"
          >
            <p className="text-[12px] text-fg">Where do we write you?</p>
            <input
              type="email"
              required
              value={claimEmail}
              onChange={(e) => setClaimEmail(e.target.value)}
              placeholder="you@studio.dev"
              className="h-9 w-full rounded-md border border-border bg-bg px-2"
            />
            <button type="submit" className="h-8 rounded-full bg-primary px-3 text-[12px] text-primary-fg">
              Next
            </button>
          </form>
        ) : user ? (
          <form onSubmit={onClaim} className="space-y-2">
            <p className="text-[12px] text-fg">How can we tell it’s yours?</p>
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
          if (!user) return;
          reportBroken(id);
          setReported(true);
          void fileLinkReport({ data: { listingId: id } }).catch(() => {});
          void awardFlints({ data: { amount: 2, reason: `dead:${id}` } })
            .then((r) => {
              if (!r.already) addFlints(2);
            })
            .catch(() => {});
        }}
        className="mt-3 text-[11px] text-muted underline"
      >
        {user ? (reported ? "Broken-link report filed. +2 Flints." : "Report a broken link") : "Sign in to report a broken link"}
      </button>
      {user ? (
        <button
          type="button"
          className="mt-2 block text-[11px] text-muted underline"
          onClick={() => {
            const shareUrl = window.location.href;
            const go = navigator.share
              ? navigator.share({ title: app.name, url: shareUrl })
              : navigator.clipboard.writeText(shareUrl);
            void Promise.resolve(go).then(() =>
              awardFlints({ data: { amount: 1, reason: `share:${id}` } }).then((r) => {
                if (!r.already) {
                  addFlints(1);
                  setNote("Shared. +1 Flint.");
                } else setNote("Already shared this one.");
              }),
            );
          }}
        >
          Share this app
        </button>
      ) : null}

      <h2 className="mt-6 text-[11px] font-medium text-muted uppercase">Appendix ratings</h2>
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
        <div className="mt-3 space-y-2">
          {reviewStep < 1 ? (
            <button
              type="button"
              onClick={() => {
                const ok = sendToInbox(id);
                setNote(ok ? "Sent to your desk inbox." : "You asked not to see this one again.");
                if (ok) setReviewStep(1);
              }}
              className="h-8 rounded-full bg-raised px-3 text-[12px] ring-1 ring-border"
            >
              Send to my desk
            </button>
          ) : null}
          {reviewStep >= 1 && lookPay(dwell) < 1 ? (
            <p className="text-[12px] text-muted">Open it, then come back. Stars show up after a real look.</p>
          ) : null}
          {lookPay(dwell) >= 1 ? (
            <form onSubmit={onRate} className="space-y-2">
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((n) => (
                  <button key={n} type="button" onClick={() => { setRating(n); setReviewStep(2); }}>
                    <Star className={n <= rating ? "size-4 fill-cat-amber text-cat-amber" : "size-4 text-subtle"} />
                  </button>
                ))}
              </div>
              {reviewStep >= 2 ? (
                <textarea
                  value={body}
                  onChange={(e) => setBody(e.target.value)}
                  placeholder="Public note. What happened when you used it?"
                  className="h-20 w-full rounded-md border border-border bg-surface p-2 text-[12px]"
                />
              ) : null}
              {reviewStep >= 2 && body.trim().length > 0 ? (
                <textarea
                  value={priv}
                  onChange={(e) => setPriv(e.target.value)}
                  placeholder="Private note for the developer. Not published."
                  className="h-20 w-full rounded-md border border-border bg-surface p-2 text-[12px]"
                />
              ) : null}
              {reviewStep >= 2 ? (
                <button type="submit" className="h-8 rounded-full bg-primary px-3 text-[12px] text-primary-fg">
                  Submit review
                </button>
              ) : null}
            </form>
          ) : null}
          {note ? <p className="text-[11px] text-muted">{note}</p> : null}
        </div>
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
