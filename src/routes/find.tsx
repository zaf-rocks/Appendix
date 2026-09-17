import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { PlayShell } from "@/components/play-shell";
import { RankList } from "@/components/rails";
import { AUDIENCES, CROWD_SUBTYPES, GENRE_META, GENRES, PLATFORMS, type Genre } from "@/lib/catalog";
import { listStore } from "@/lib/store-api";
import { useLens } from "@/lib/lens";
import { throughLens } from "@/lib/provenance";
import { cn } from "@/lib/cn";

const SUBCAT: Partial<Record<Genre, string[]>> = {
  games: ["Puzzle", "Arcade", "Board", "Idle"],
  music: ["Make", "Listen", "Karaoke"],
  photo: ["Edit", "Shoot", "Share"],
  education: ["Classroom", "Self-teach", "Kids"],
  productivity: ["Notes", "Boards", "Timers"],
  social: ["Chat", "Rooms", "Feed"],
  tools: ["Dev", "Convert", "Utilities"],
};

export const Route = createFileRoute("/find")({
  loader: () => listStore(),
  component: Find,
});

function ChipRow({ children }: { children: React.ReactNode }) {
  return <div className="flex flex-wrap gap-1 pb-1">{children}</div>;
}

function Chip({
  on,
  onClick,
  children,
}: {
  on: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn("chip-lens h-6 rounded-full px-2.5 text-[10px] leading-6", on ? "chip-lens-on" : "text-muted")}
    >
      {children}
    </button>
  );
}

function Find() {
  const catalog = throughLens(Route.useLoaderData(), useLens().lens);
  const [q, setQ] = useState("");
  const [genres, setGenres] = useState<Genre[]>([]);
  const [sub, setSub] = useState<string | null>(null);
  const [live, setLive] = useState<"all" | "live" | "soon">("all");
  const [platform, setPlatform] = useState("any");
  const [crowd, setCrowd] = useState<string | null>(null);
  const [role, setRole] = useState<string | null>(null);

  function toggleGenre(g: Genre) {
    setSub(null);
    setGenres((cur) => {
      if (cur.includes(g)) return cur.filter((x) => x !== g);
      if (cur.length >= 3) return [...cur.slice(1), g];
      return [...cur, g];
    });
  }

  const crowdMeta = AUDIENCES.find((a) => a.id === crowd);
  const roles = crowd ? CROWD_SUBTYPES[crowd] || [] : [];
  const subs = genres.length === 1 ? SUBCAT[genres[0]] || [] : [];

  const filtered = useMemo(() => {
    const query = q.trim().toLowerCase();
    return catalog.filter((a) => {
      if (genres.length && !genres.some((g) => a.genres.includes(g))) return false;
      if (crowdMeta && !a.genres.some((g) => crowdMeta.match.includes(g))) return false;
      if (role && !(a.roles || []).includes(role)) return false;
      if (live === "live" && (a.comingSoon || a.url === "#")) return false;
      if (live === "soon" && !a.comingSoon) return false;
      if (platform !== "any" && (a.platform || "Unknown") !== platform) return false;
      if (sub && !`${a.tagline} ${a.name} ${a.genres.join(" ")}`.toLowerCase().includes(sub.toLowerCase())) {
        if (sub === "Make" && !(a.roles || []).some((r) => ["singers", "producers", "djs"].includes(r))) return false;
        if (sub === "Listen" && !(a.roles || []).includes("listeners")) return false;
      }
      if (!query) return true;
      return (
        a.name.toLowerCase().includes(query) ||
        a.developer.toLowerCase().includes(query) ||
        a.tagline.toLowerCase().includes(query)
      );
    });
  }, [catalog, q, genres, live, platform, crowdMeta, role, sub]);

  return (
    <PlayShell heroTitle="Find" heroLine="What should this app do for me? Every tap eliminates.">
      <input
        value={q}
        onChange={(e) => setQ(e.target.value)}
        placeholder="What should this app do for you?"
        className="h-8 w-full rounded-md border border-border bg-surface px-3 text-[12px] outline-none"
      />

      <p className="mt-3 text-[10px] tracking-wide text-muted uppercase">Crowd</p>
      <ChipRow>
        <Chip on={!crowd} onClick={() => { setCrowd(null); setRole(null); }}>
          Anyone
        </Chip>
        {AUDIENCES.map((a) => (
          <Chip
            key={a.id}
            on={crowd === a.id}
            onClick={() => {
              setCrowd(a.id);
              setRole(null);
            }}
          >
            {a.label}
          </Chip>
        ))}
      </ChipRow>
      {roles.length ? (
        <>
          <p className="mt-2 text-[10px] tracking-wide text-muted uppercase">Role</p>
          <ChipRow>
            {roles.map((r) => (
              <Chip key={r.id} on={role === r.id} onClick={() => setRole(role === r.id ? null : r.id)}>
                {r.label}
              </Chip>
            ))}
          </ChipRow>
        </>
      ) : null}

      <p className="mt-3 text-[10px] tracking-wide text-muted uppercase">Category · up to 3</p>
      <ChipRow>
        {GENRES.filter((g) => g !== "coming-soon").map((g) => (
          <Chip key={g} on={genres.includes(g)} onClick={() => toggleGenre(g)}>
            {GENRE_META[g].label}
          </Chip>
        ))}
      </ChipRow>
      {subs.length ? (
        <>
          <p className="mt-2 text-[10px] tracking-wide text-muted uppercase">Subcategory</p>
          <ChipRow>
            {subs.map((s) => (
              <Chip key={s} on={sub === s} onClick={() => setSub(sub === s ? null : s)}>
                {s}
              </Chip>
            ))}
          </ChipRow>
        </>
      ) : null}

      <p className="mt-3 text-[10px] tracking-wide text-muted uppercase">Status</p>
      <ChipRow>
        {(["all", "live", "soon"] as const).map((p) => (
          <Chip key={p} on={live === p} onClick={() => setLive(p)}>
            {p === "live" ? "Live" : p === "soon" ? "Coming soon" : "Any"}
          </Chip>
        ))}
      </ChipRow>

      <p className="mt-3 text-[10px] tracking-wide text-muted uppercase">Built on</p>
      <ChipRow>
        <Chip on={platform === "any"} onClick={() => setPlatform("any")}>
          Any builder
        </Chip>
        {PLATFORMS.map((p) => (
          <Chip key={p} on={platform === p} onClick={() => setPlatform(p)}>
            {p}
          </Chip>
        ))}
      </ChipRow>
      {platform !== "any" ? (
        <p className="mt-1 text-[10px] text-muted">
          {filtered.length} indexed on {platform}. This is the directory, not Forge.
        </p>
      ) : null}

      <p className="mt-3 text-[11px] text-muted">
        {filtered.length} remain · swipe right saves · swipe left peeks · long-press saves
      </p>
      <RankList apps={filtered} swipe />
      <p className="mt-3 text-[11px] text-muted">
        Saved stack lives in{" "}
        <Link to="/saved" className="text-primary">
          Bookmarks
        </Link>
        .
      </p>
    </PlayShell>
  );
}
