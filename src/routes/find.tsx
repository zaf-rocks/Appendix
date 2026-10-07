import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import { PlayShell } from "@/components/play-shell";
import { RankList } from "@/components/rails";
import { AUDIENCES, CROWD_SUBTYPES, GENRE_META, GENRES, PLATFORMS, type Genre } from "@/lib/catalog";
import { listStore } from "@/lib/store-api";
import { useLens } from "@/lib/lens";
import { throughLens } from "@/lib/provenance";
import { cn } from "@/lib/cn";
import { specTri } from "@/lib/spectrum";
import { TAG_LIST } from "@/lib/tags";

const SUBCAT: Partial<Record<Genre, string[]>> = {
  games: ["Puzzle", "Arcade", "Board", "Idle"],
  music: ["Make", "Listen", "Karaoke"],
  photo: ["Edit", "Shoot", "Share"],
  education: ["Classroom", "Self-teach", "Kids"],
  productivity: ["Notes", "Boards", "Timers"],
  social: ["Chat", "Rooms", "Feed"],
  tools: ["Dev", "Convert", "Utilities"],
};

type Search = { tags?: string; genre?: string; platform?: string };

export const Route = createFileRoute("/find")({
  validateSearch: (raw: Record<string, unknown>): Search => ({
    tags: typeof raw.tags === "string" ? raw.tags : "",
    genre: typeof raw.genre === "string" ? raw.genre : "",
    platform: typeof raw.platform === "string" ? raw.platform : "",
  }),
  loader: () => listStore(),
  component: Find,
});

function ChipRow({ children }: { children: React.ReactNode }) {
  return <div className="flex flex-wrap gap-1 pb-1">{children}</div>;
}

let specCursor = 0;

function Chip({
  on,
  onClick,
  children,
}: {
  on: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  const i = specCursor++;
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

function Find() {
  specCursor = 0;
  const catalog = throughLens(Route.useLoaderData(), useLens().lens);
  const search = Route.useSearch();
  const navigate = useNavigate();
  const [q, setQ] = useState("");
  const [genres, setGenres] = useState<Genre[]>([]);
  const [sub, setSub] = useState<string | null>(null);
  const [live, setLive] = useState<"all" | "live" | "soon">("all");
  const [platform, setPlatform] = useState(search.platform || "any");
  const [crowd, setCrowd] = useState<string | null>(null);
  const [role, setRole] = useState<string | null>(null);
  const [sort, setSort] = useState<"popular" | "new" | "name" | "developer" | "platform">("popular");

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
      const wanted = (search.tags || "").split(",").map((s) => s.trim()).filter(Boolean);
      if (wanted.length && !wanted.every((t) => (a.tags || []).some((x) => x.toLowerCase() === t.toLowerCase()))) return false;
      if (search.genre && !a.genres.includes(search.genre as Genre)) return false;
      if (sub && !`${a.tagline} ${a.name} ${a.genres.join(" ")}`.toLowerCase().includes(sub.toLowerCase())) {
        if (sub === "Make" && !(a.roles || []).some((r) => ["singers", "producers", "djs"].includes(r))) return false;
        if (sub === "Listen" && !(a.roles || []).includes("listeners")) return false;
      }
      if (!query) return true;
      return (
        a.name.toLowerCase().includes(query) ||
        a.developer.toLowerCase().includes(query) ||
        a.tagline.toLowerCase().includes(query) ||
        (a.tags || []).some((t) => t.toLowerCase().includes(query))
      );
    });
  }, [catalog, q, genres, live, platform, crowdMeta, role, sub, search.tags, search.genre]);

  const pickedTags = (search.tags || "").split(",").map((s) => s.trim()).filter(Boolean);
  function toggleTag(tag: string) {
    const next = pickedTags.some((t) => t.toLowerCase() === tag.toLowerCase())
      ? pickedTags.filter((t) => t.toLowerCase() !== tag.toLowerCase())
      : [...pickedTags, tag];
    void navigate({ to: "/find", search: { ...search, tags: next.join(",") } });
  }
  const tagChoices = [...new Set([...TAG_LIST, ...pickedTags])].filter((tag) =>
    catalog.some((a) => (a.tags || []).some((t) => t.toLowerCase() === tag.toLowerCase())) || pickedTags.some((t) => t.toLowerCase() === tag.toLowerCase()),
  );
  const shown = useMemo(() => {
    const next = [...filtered];
    if (sort === "name") next.sort((a, b) => a.name.localeCompare(b.name));
    else if (sort === "developer") next.sort((a, b) => a.developer.localeCompare(b.developer) || a.name.localeCompare(b.name));
    else if (sort === "platform") next.sort((a, b) => (a.platform || "").localeCompare(b.platform || "") || a.name.localeCompare(b.name));
    else if (sort === "popular") next.sort((a, b) => b.ratingsCount - a.ratingsCount || b.rating - a.rating || a.name.localeCompare(b.name));
    return next;
  }, [filtered, sort]);

  return (
    <PlayShell heroTitle="Find" heroLine="What should this app do for me? Every tap eliminates.">
      <label className="search-field">
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="What should this app do for you?"
        />
        <Search className="search-field-icon" aria-hidden />
      </label>

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

      <p className="mt-3 text-[10px] tracking-wide text-muted uppercase">Tags · combine them</p>
      <ChipRow>
        {tagChoices.map((tag) => (
          <Chip key={tag} on={pickedTags.some((t) => t.toLowerCase() === tag.toLowerCase())} onClick={() => toggleTag(tag)}>
            {tag}
          </Chip>
        ))}
      </ChipRow>
      <p className="mt-1 text-[10px] text-muted">Odd words and emoji are searchable in the box. They are not all listed.</p>

      <p className="mt-3 text-[10px] tracking-wide text-muted uppercase">Order</p>
      <ChipRow>
        {(
          [
            ["popular", "Popular"],
            ["new", "Newest"],
            ["name", "A–Z"],
            ["developer", "Developer"],
            ["platform", "Platform"],
          ] as const
        ).map(([id, label]) => (
          <Chip key={id} on={sort === id} onClick={() => setSort(id)}>
            {label}
          </Chip>
        ))}
      </ChipRow>

      <p className="mt-3 text-[11px] text-muted">
        {filtered.length} remain · swipe right saves · swipe left peeks · long-press saves
      </p>
      <RankList apps={shown} swipe />
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
