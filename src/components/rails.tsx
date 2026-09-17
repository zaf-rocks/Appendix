import { Link, useNavigate } from "@tanstack/react-router";
import { useRef, useState } from "react";
import { Bookmark, Star } from "lucide-react";
import { AppIcon } from "@/components/app-icon";
import { StatusDot } from "@/components/store-shell";
import { listingStatus, type AppEntry } from "@/lib/catalog";
import { isSaved, openCount, toggleSave } from "@/lib/yard";
import { cn } from "@/lib/cn";

function save(id: string) {
  return toggleSave(id).includes(id);
}

function splitRows(apps: AppEntry[], rows: number) {
  if (rows <= 1) return [apps];
  const size = Math.ceil(apps.length / rows) || 1;
  return Array.from({ length: rows }, (_, i) => apps.slice(i * size, (i + 1) * size));
}

export function Rail({
  title,
  apps,
  rows = 1,
  special,
  emptyHint = "Nothing vibe-coded in this aisle yet.",
}: {
  title: string;
  apps: AppEntry[];
  rows?: number;
  special?: boolean;
  emptyHint?: string;
}) {
  const shown = apps.slice(0, 80);
  const bands = splitRows(shown, rows);
  return (
    <section>
      {special ? (
        <h2 className="special-bar">{title}</h2>
      ) : (
        <h2 className="text-[10px] font-medium tracking-wide text-muted uppercase">{title}</h2>
      )}
      {shown.length ? (
        <div className="mt-1.5 space-y-2">
          {bands.map((band, i) => (
            <div key={i} className="-mx-3 flex gap-1.5 overflow-x-auto px-3 pb-0.5">
              {band.map((app) => (
                <RailCard key={app.id} app={app} />
              ))}
            </div>
          ))}
        </div>
      ) : (
        <p className="mt-1.5 text-[11px] text-muted">{emptyHint}</p>
      )}
    </section>
  );
}

function RailCard({ app }: { app: AppEntry }) {
  const [saved, setSaved] = useState(() => isSaved(app.id));
  const hold = useRef<number | null>(null);
  function press() {
    hold.current = window.setTimeout(() => setSaved(save(app.id)), 450);
  }
  function clear() {
    if (hold.current) window.clearTimeout(hold.current);
    hold.current = null;
  }
  return (
    <Link
      to="/app/$id"
      params={{ id: app.id }}
      search={{ desk: undefined }}
      className="w-[58px] shrink-0"
      onContextMenu={(e) => {
        e.preventDefault();
        setSaved(save(app.id));
      }}
      onTouchStart={press}
      onTouchEnd={clear}
      onMouseDown={press}
      onMouseUp={clear}
      onMouseLeave={clear}
    >
      <AppIcon name={app.name} iconUrl={app.iconUrl} className="size-12 rounded-[22%] text-[10px]" />
      <p className="mt-0.5 truncate text-[8px] leading-tight font-medium">{app.name}</p>
      <p className="flex items-center gap-0.5 truncate text-[7px] text-muted">
        <StatusDot app={app} />
        {app.developer}
      </p>
    </Link>
  );
}

export function FeatureRail({ title, apps, kind }: { title: string; apps: AppEntry[]; kind: "sponsored" | "editors" }) {
  const shown = apps.slice(0, 16);
  const box = kind === "sponsored" ? "size-[58px]" : "size-[54px]";
  const col = kind === "sponsored" ? "w-[62px]" : "w-[58px]";
  return (
    <section>
      <h2 className="special-bar">{title}</h2>
      {shown.length ? (
        <div className="-mx-3 mt-1.5 flex gap-1.5 overflow-x-auto px-3 pb-0.5">
          {shown.map((app) => (
            <Link
              key={app.id}
              to="/app/$id"
              params={{ id: app.id }}
              search={{ desk: undefined }}
              className={cn(col, "shrink-0")}
            >
              <AppIcon name={app.name} iconUrl={app.iconUrl} className={cn(box, "rounded-[22%] text-[10px]")} />
              <p className="mt-0.5 truncate text-[8px] leading-tight font-medium">{app.name}</p>
              <p className="truncate text-[7px] text-muted">{app.developer}</p>
            </Link>
          ))}
        </div>
      ) : (
        <p className="mt-1.5 text-[11px] text-muted">Nothing vibe-coded in this aisle yet.</p>
      )}
    </section>
  );
}

export function RankList({ apps, swipe }: { apps: AppEntry[]; swipe?: boolean }) {
  return (
    <ol className="mt-1">
      {apps.slice(0, 120).map((app, i) => (
        <RankRow key={app.id} app={app} n={i + 1} swipe={swipe} />
      ))}
    </ol>
  );
}

function RankRow({ app, n, swipe }: { app: AppEntry; n: number; swipe?: boolean }) {
  const nav = useNavigate();
  const startX = useRef(0);
  const [dx, setDx] = useState(0);
  const [saved, setSaved] = useState(() => isSaved(app.id));
  const [peek, setPeek] = useState(false);
  const clicks = app.clicks ?? openCount(app.id);
  const hold = useRef<number | null>(null);
  const status = listingStatus(app);

  function onStart(x: number) {
    if (!swipe) return;
    startX.current = x;
  }
  function onMove(x: number) {
    if (!swipe || !startX.current) return;
    setDx(Math.max(-88, Math.min(88, x - startX.current)));
  }
  function onEnd() {
    if (!swipe) return;
    if (dx > 56) setSaved(save(app.id));
    else if (dx < -56) setPeek((p) => !p);
    setDx(0);
    startX.current = 0;
  }

  return (
    <li className="border-b border-line">
      <div
        className="relative overflow-hidden"
        onTouchStart={(e) => {
          onStart(e.touches[0].clientX);
          hold.current = window.setTimeout(() => setSaved(save(app.id)), 450);
        }}
        onTouchMove={(e) => {
          onMove(e.touches[0].clientX);
          if (hold.current) window.clearTimeout(hold.current);
        }}
        onTouchEnd={() => {
          onEnd();
          if (hold.current) window.clearTimeout(hold.current);
        }}
        onMouseDown={(e) => onStart(e.clientX)}
        onMouseMove={(e) => e.buttons === 1 && onMove(e.clientX)}
        onMouseUp={onEnd}
        onContextMenu={(e) => {
          e.preventDefault();
          setSaved(save(app.id));
        }}
      >
        {swipe ? (
          <div className="absolute inset-y-0 right-0 grid w-20 place-items-center bg-get text-[10px] font-semibold text-get-fg">
            Save
          </div>
        ) : null}
        <div
          className="flex w-full items-center gap-1.5 bg-bg py-1.5 text-left"
          style={swipe ? { transform: `translateX(${dx}px)` } : undefined}
        >
          <button
            type="button"
            onClick={() => nav({ to: "/app/$id", params: { id: app.id }, search: { desk: undefined } })}
            className="flex min-w-0 flex-1 items-center gap-1.5 text-left"
          >
            <span className="w-4 text-[10px] text-subtle">{n}</span>
            <AppIcon name={app.name} iconUrl={app.iconUrl} className="size-10 text-[10px]" />
            <div className="min-w-0 flex-1">
              <p className="flex items-center gap-1 truncate text-[12px] font-medium">
                <StatusDot app={app} />
                {app.name}
              </p>
              <p className="truncate text-[10px] text-muted">
                {app.developer} · {clicks} opens
              </p>
            </div>
          </button>
          <button
            type="button"
            aria-label={saved ? "Unsave" : "Save"}
            onClick={(e) => {
              e.stopPropagation();
              setSaved(save(app.id));
            }}
            className="grid size-9 place-items-center"
          >
            <Bookmark className={cn("size-3.5", saved ? "fill-cat-amber text-cat-amber" : "text-muted")} />
          </button>
          <span className="flex items-center gap-0.5 pr-1 text-[9px] text-muted">
            <Star className="size-2.5 fill-cat-amber text-cat-amber" />
            {app.ratingsCount ? app.rating.toFixed(1) : "—"}
          </span>
        </div>
      </div>
      {peek ? (
        <p className="pb-2 pl-8 text-[11px] text-muted">
          {app.tagline}
          {app.platform ? ` · Built with ${app.platform}` : ""}
          {app.genres[0] ? ` · ${app.genres[0]}` : ""}
          {status === "soon" ? " · Coming soon" : status === "dead" ? " · Unavailable" : ""}
        </p>
      ) : null}
    </li>
  );
}
