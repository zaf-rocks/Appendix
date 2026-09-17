import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { PlayShell } from "@/components/play-shell";
import { RankList } from "@/components/rails";
import { listStore } from "@/lib/store-api";
import { customIds, customName, favIds, savedIds, setCustomName, setSavedOrder, toggleCustom, toggleFav } from "@/lib/yard";
import { cn } from "@/lib/cn";

export const Route = createFileRoute("/saved")({
  loader: () => listStore(),
  component: Saved,
});

function Saved() {
  const catalog = Route.useLoaderData();
  const [tab, setTab] = useState<"all" | "fav" | "custom">("all");
  const [q, setQ] = useState("");
  const [name, setName] = useState(() => customName());
  const [, bump] = useState(0);

  const ids =
    tab === "fav" ? favIds() : tab === "custom" ? customIds() : savedIds();
  const apps = useMemo(() => {
    const query = q.trim().toLowerCase();
    return catalog.filter((a) => ids.includes(a.id) && (!query || a.name.toLowerCase().includes(query) || a.developer.toLowerCase().includes(query)));
  }, [catalog, ids, q]);

  return (
    <PlayShell heroTitle="Bookmarks" heroLine="Not downloads. The ones you meant to keep.">
      <input
        value={q}
        onChange={(e) => setQ(e.target.value)}
        placeholder="Search bookmarks"
        className="h-8 w-full rounded-md border border-border bg-surface px-3 text-[12px]"
      />
      <div className="mt-2 flex gap-1">
        {([
          ["all", "Bookmarks"],
          ["fav", "Favorites"],
          ["custom", name],
        ] as const).map(([id, label]) => (
          <button
            key={id}
            type="button"
            onClick={() => setTab(id)}
            className={cn("chip-lens h-7 rounded-full px-3 text-[11px]", tab === id && "chip-lens-on")}
          >
            {label}
          </button>
        ))}
      </div>
      {tab === "custom" ? (
        <input
          value={name}
          onChange={(e) => {
            setName(e.target.value);
            setCustomName(e.target.value);
          }}
          className="mt-2 h-8 w-full rounded-md border border-border bg-surface px-2 text-[12px]"
        />
      ) : null}
      <p className="mt-2 text-[10px] text-muted">
        Long-press a row to pin it to Favorites or {name}. Drag order is the save order — use the arrows.
      </p>
      {apps.length ? (
        <>
          <RankList apps={apps} swipe />
          <div className="mt-2 flex flex-wrap gap-1">
            {apps.map((a, i) => (
              <button
                key={a.id}
                type="button"
                className="text-[10px] text-muted"
                onClick={() => {
                  const next = [...ids];
                  if (i === 0) return;
                  [next[i - 1], next[i]] = [next[i], next[i - 1]];
                  if (tab === "all") setSavedOrder(next);
                  bump((n) => n + 1);
                }}
              >
                ↑ {a.name}
              </button>
            ))}
          </div>
          <div className="mt-2 flex gap-2 text-[11px]">
            {apps[0] ? (
              <>
                <button type="button" onClick={() => { toggleFav(apps[0].id); bump((n) => n + 1); }} className="text-primary">
                  Favorite first
                </button>
                <button type="button" onClick={() => { toggleCustom(apps[0].id); bump((n) => n + 1); }} className="text-primary">
                  Add first to {name}
                </button>
              </>
            ) : null}
          </div>
        </>
      ) : (
        <p className="mt-3 text-[13px] text-muted">
          Swipe right on Find, or long-press a card. That’s the save. There’s no APK to keep.
        </p>
      )}
    </PlayShell>
  );
}
