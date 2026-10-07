import { Link, useNavigate } from "@tanstack/react-router";
import { useRef, useState } from "react";
import { Bookmark, Star } from "lucide-react";
import { AppIcon } from "@/components/app-icon";
import { PeekSave } from "@/components/peek-save";
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
      <h2 className="special-bar">{title}</h2>
      {shown.length ? (
        <div className="mt-1 space-y-2">
          {bands.map((band, i) => (
            <div key={i} className={cn("rail-track no-bar", special && "rail-track-feature")}>
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
      className="rail-tile"
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
      <div className="aspect-square w-full">
        <AppIcon name={app.name} iconUrl={app.iconUrl} className="size-full rounded-[22%] text-[10px]" />
      </div>
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
  return (
    <section>
      <h2 className="special-bar">{title}</h2>
      {shown.length ? (
        <div className={cn("rail-track no-bar mt-1", kind === "sponsored" ? "rail-track-sponsored" : "rail-track-feature")}>
          {shown.map((app) => (
            <Link
              key={app.id}
              to="/app/$id"
              params={{ id: app.id }}
              search={{ desk: undefined }}
              className="rail-tile"
            >
              <div className="aspect-square w-full">
                <AppIcon name={app.name} iconUrl={app.iconUrl} className="size-full rounded-[22%] text-[10px]" />
              </div>
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

export function RankList({ apps, swipe, onChanged }: { apps: AppEntry[]; swipe?: boolean; onChanged?: () => void }) {
  return (
    <ol className="mt-1">
      {apps.slice(0, 120).map((app, i) => (
        <RankRow key={app.id} app={app} n={i + 1} swipe={swipe} onChanged={onChanged} />
      ))}
    </ol>
  );
}

function RankRow({ app, n, swipe, onChanged }: { app: AppEntry; n: number; swipe?: boolean; onChanged?: () => void }) {
  const nav = useNavigate();
  const startX = useRef(0);
  const ignore = useRef(false);
  const [dx, setDx] = useState(0);
  const [saved, setSaved] = useState(() => isSaved(app.id));
  const [peek, setPeek] = useState(false);
  const [menu, setMenu] = useState(false);
  const clicks = app.clicks ?? openCount(app.id);
  const hold = useRef<number | null>(null);
  const status = listingStatus(app);

  function openMenu() {
    setMenu(true);
  }

  function onStart(x: number) {
    if (!swipe) return;
    if (x < 28 || x > window.innerWidth - 28) {
      ignore.current = true;
      startX.current = 0;
      return;
    }
    ignore.current = false;
    startX.current = x;
  }
  function onMove(x: number) {
    if (!swipe || ignore.current || !startX.current) return;
    setDx(Math.max(-88, Math.min(88, x - startX.current)));
  }
  function onEnd() {
    if (!swipe) return;
    if (!ignore.current) {
      if (dx > 56) {
        if (isSaved(app.id)) openMenu();
        else setSaved(save(app.id));
        onChanged?.();
      } else if (dx < -56) setPeek((p) => !p);
    }
    setDx(0);
    startX.current = 0;
    ignore.current = false;
  }

  return (
    <li className={cn("border-b border-line", peek && "min-h-[6.5rem]")}>
      <div
        className="relative overflow-hidden"
        onTouchStart={(e) => {
          onStart(e.touches[0].clientX);
          hold.current = window.setTimeout(() => openMenu(), 450);
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
          openMenu();
        }}
      >
        {swipe ? (
          <>
            <div className="swipe-save-label absolute inset-y-0 left-0 grid w-20 place-items-center text-[10px] font-semibold">
              Save
            </div>
            <div className="swipe-peek-label absolute inset-y-0 right-0 grid w-20 place-items-center text-[10px] font-semibold">
              PEEK
            </div>
          </>
        ) : null}
        <div
          className="relative flex w-full items-center gap-1.5 bg-bg py-1.5 text-left"
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
            aria-label={saved ? "Bookmark options" : "Save"}
            onClick={(e) => {
              e.stopPropagation();
              if (isSaved(app.id)) openMenu();
              else {
                setSaved(save(app.id));
                onChanged?.();
              }
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
        <div className="pb-2 pl-8 text-[11px] text-muted">
          <p>{app.tagline}</p>
          <p className="mt-0.5">
            {app.developer}
            {app.platform ? ` · Built with ${app.platform}` : ""}
            {app.genres[0] ? ` · ${app.genres[0]}` : ""}
            {app.installable ? " · Installable" : ""}
            {app.offline ? " · Offline" : ""}
            {app.aiBuilt ? " · AI assisted" : ""}
            {status === "soon" ? " · Coming soon" : status === "dead" ? " · Unavailable" : ""}
          </p>
          {app.description ? <p className="mt-0.5 line-clamp-3">{app.description}</p> : null}
        </div>
      ) : null}
      {menu ? (
        <PeekSave
          app={app}
          onClose={() => {
            setMenu(false);
            setSaved(isSaved(app.id));
            onChanged?.();
          }}
        />
      ) : null}
    </li>
  );
}
