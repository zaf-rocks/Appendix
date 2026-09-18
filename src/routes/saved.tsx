import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import { PlayShell } from "@/components/play-shell";
import { RankList } from "@/components/rails";
import { listStore } from "@/lib/store-api";
import {
  addStack,
  deleteStack,
  favIds,
  listStacks,
  renameStack,
  savedIds,
  setFavOrder,
  setSavedOrder,
  setStackOrder,
} from "@/lib/yard";
import { cn } from "@/lib/cn";

export const Route = createFileRoute("/saved")({
  loader: () => listStore(),
  component: Saved,
});

type Tab = { id: string; label: string };

function tabLabel(text: string) {
  const t = text.trim() || "Stack";
  return (
    <>
      <span className="text-[12px] leading-none">{t[0]}</span>
      <span className="text-[9px] leading-none tracking-wide uppercase">{t.slice(1)}</span>
    </>
  );
}

export function Saved() {
  const catalog = Route.useLoaderData();
  const [tab, setTab] = useState("all");
  const [q, setQ] = useState("");
  const [stacks, setStacks] = useState(() => listStacks());
  const [, bump] = useState(0);

  const ids =
    tab === "all" ? savedIds() : tab === "fav" ? favIds() : stacks.find((s) => s.id === tab)?.ids || [];
  const apps = useMemo(() => {
    const query = q.trim().toLowerCase();
    return catalog.filter(
      (a) => ids.includes(a.id) && (!query || a.name.toLowerCase().includes(query) || a.developer.toLowerCase().includes(query)),
    );
  }, [catalog, ids, q]);

  const tabs: Tab[] = [{ id: "all", label: "Bookmarks" }, { id: "fav", label: "Favorites" }, ...stacks.map((s) => ({ id: s.id, label: s.name }))];
  const activeStack = stacks.find((s) => s.id === tab);

  function move(i: number, dir: -1 | 1) {
    const j = i + dir;
    if (j < 0 || j >= ids.length) return;
    const next = [...ids];
    [next[i], next[j]] = [next[j], next[i]];
    if (tab === "all") setSavedOrder(next);
    else if (tab === "fav") setFavOrder(next);
    else setStackOrder(tab, next);
    bump((n) => n + 1);
  }

  return (
    <PlayShell heroTitle="Bookmarks" heroLine="Not downloads. The ones you meant to keep.">
      <label className="bookmark-search">
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search bookmarks"
        />
        <Search className="bookmark-search-icon" aria-hidden />
      </label>
      <div className="mt-2 flex flex-wrap gap-1">
        {tabs.map((t, i) => (
          <button
            key={t.id}
            type="button"
            onClick={() => setTab(t.id)}
            data-tone={String((i % 3) + 1)}
            className={cn("stack-tab", tab === t.id && "stack-tab-on")}
          >
            <span className="stack-tab-face">{tabLabel(t.label)}</span>
          </button>
        ))}
        <button
          type="button"
          className="stack-tab stack-tab-add"
          onClick={() => {
            const next = addStack(`Stack ${stacks.length + 1}`);
            setStacks(next);
            setTab(next[next.length - 1].id);
          }}
        >
          <span className="stack-tab-face">+</span>
        </button>
      </div>
      {activeStack ? (
        <div className="mt-2 flex gap-2">
          <input
            value={activeStack.name}
            onChange={(e) => setStacks(renameStack(activeStack.id, e.target.value))}
            className="h-8 min-w-0 flex-1 rounded-md border border-white/10 bg-black/30 px-2 text-[12px]"
          />
          <button
            type="button"
            className="text-[11px] text-down"
            onClick={() => {
              const next = deleteStack(activeStack.id);
              setStacks(next);
              setTab("all");
            }}
          >
            Delete tab
          </button>
        </div>
      ) : null}
      <p className="mt-2 text-[10px] text-muted">
        Swipe right to save. Already saved? Swipe right or long-press for stacks. Swipe left to peek. ↑↓ to reorder.
      </p>
      {apps.length ? (
        <>
          <RankList apps={apps} swipe onChanged={() => bump((n) => n + 1)} />
          <div className="mt-2 flex flex-wrap gap-1">
            {apps.map((a, i) => (
              <span key={a.id} className="flex items-center gap-1 text-[10px] text-muted">
                <button type="button" onClick={() => move(i, -1)} aria-label={`Move ${a.name} up`}>
                  ↑
                </button>
                <button type="button" onClick={() => move(i, 1)} aria-label={`Move ${a.name} down`}>
                  ↓
                </button>
                {a.name}
              </span>
            ))}
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