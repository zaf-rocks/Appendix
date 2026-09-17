import { createFileRoute, Link } from "@tanstack/react-router";
import { PlayShell } from "@/components/play-shell";
import { FeatureRail, Rail, RankList } from "@/components/rails";
import { RailRule } from "@/components/rail-rule";
import { AUDIENCES, GENRE_META, GENRES, type Genre } from "@/lib/catalog";
import { listStore } from "@/lib/store-api";
import { useLens } from "@/lib/lens";
import { throughLens } from "@/lib/provenance";
import { allOpens } from "@/lib/yard";

type Search = { rail?: string };

export const Route = createFileRoute("/")({
  validateSearch: (raw: Record<string, unknown>): Search => ({
    rail: typeof raw.rail === "string" ? raw.rail : "a",
  }),
  loader: () => listStore(),
  component: Home,
});

function Home() {
  const raw = Route.useLoaderData();
  const { lens } = useLens();
  const catalog = throughLens(raw, lens);
  const { rail = "a" } = Route.useSearch();
  const featured = catalog.filter((a) => a.featured);
  const sponsored = catalog.filter((a) => a.sponsored);
  const editors = catalog.filter((a) => a.editorsPick);
  const live = catalog.filter((a) => a.url && a.url !== "#" && !a.comingSoon);
  const odd = catalog.filter((a) => a.aiBuilt || a.comingSoon || a.platform === "Grok");
  const opens = allOpens();
  const charts = [...catalog].sort((a, b) => (opens[b.id] || 0) - (opens[a.id] || 0));

  return (
    <PlayShell letters rail={rail}>
      {rail === "b" ? (
        <>
          <p className="text-[11px] text-muted">Highest genuine opens on this yard. Nothing invented.</p>
          <RankList apps={charts.slice(0, 80)} swipe />
        </>
      ) : rail === "c" ? (
        <>
          <p className="text-[11px] text-muted">The aisle a native store would call a rounding error.</p>
          <Rail title="AI-built & soon" apps={odd} />
          <RailRule i={0} />
          <Rail title="Editors kept anyway" apps={editors} special />
          <RailRule i={1} />
          <Rail title="Weird on purpose" apps={catalog.filter((a) => ["webamp", "radio-garden", "hextris", "krunker", "scratch", "regex101"].includes(a.id))} />
        </>
      ) : rail === "d" ? (
        AUDIENCES.map((aud, i) => (
          <div key={aud.id}>
            {i ? <RailRule i={i} /> : null}
            <Rail title={aud.label} apps={catalog.filter((a) => a.genres.some((g) => aud.match.includes(g)))} />
          </div>
        ))
      ) : rail === "e" ? (
        <ul className="divide-y divide-line">
          {GENRES.map((g) => (
            <li key={g}>
              <Link to="/" search={{ rail: "a" }} className="flex items-center justify-between py-2 text-[12px]">
                {GENRE_META[g].label}
                <span className="text-[10px] text-muted">{catalog.filter((a) => a.genres.includes(g)).length}</span>
              </Link>
            </li>
          ))}
        </ul>
      ) : rail === "f" ? (
        <>
          <FeatureRail title="Editors' Choice" apps={editors} kind="editors" />
          <RailRule i={0} />
          <Rail title="Featured" apps={featured} />
        </>
      ) : (
        <>
          <Rail title="Suggested for you" apps={featured.length ? featured : live.slice(0, 16)} special />
          <RailRule i={0} />
          <FeatureRail title="Sponsored" apps={sponsored.length ? sponsored : editors} kind="sponsored" />
          <RailRule i={1} />
          <Rail title="Trending opens" apps={live.slice(0, 24)} />
          <RailRule i={2} />
          <FeatureRail title="Editors' Choice" apps={editors} kind="editors" />
          {(["games", "productivity", "photo", "music", "tools", "education", "social"] as Genre[]).map((g, i) => (
            <div key={g}>
              <RailRule i={i} />
              <Rail title={GENRE_META[g].label} apps={catalog.filter((a) => a.genres.includes(g))} />
              {i === 2 ? (
                <>
                  <RailRule i={i + 1} />
                  <FeatureRail title="Sponsored" apps={sponsored} kind="sponsored" />
                </>
              ) : null}
            </div>
          ))}
        </>
      )}
    </PlayShell>
  );
}
