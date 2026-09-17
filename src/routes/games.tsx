import { createFileRoute } from "@tanstack/react-router";
import { PlayShell } from "@/components/play-shell";
import { FeatureRail, Rail, RankList } from "@/components/rails";
import { RailRule } from "@/components/rail-rule";
import { AUDIENCES } from "@/lib/catalog";
import { listStore } from "@/lib/store-api";
import { useLens } from "@/lib/lens";
import { throughLens } from "@/lib/provenance";

type Search = { rail?: string };

export const Route = createFileRoute("/games")({
  validateSearch: (raw: Record<string, unknown>): Search => ({
    rail: typeof raw.rail === "string" ? raw.rail : "a",
  }),
  loader: () => listStore(),
  component: Games,
});

function Games() {
  const catalog = throughLens(Route.useLoaderData(), useLens().lens);
  const { rail = "a" } = Route.useSearch();
  const games = catalog.filter((a) => a.genres.includes("games"));
  const free = games.filter((a) => !a.paid);

  return (
    <PlayShell letters rail={rail} heroTitle="Games" heroLine="No APK. No store clerk. Just a tab that wants to play.">
      {rail === "b" ? (
        <>
          <h2 className="special-bar">Top opens</h2>
          <RankList apps={free} swipe />
        </>
      ) : rail === "c" ? (
        <>
          <Rail title="Browser-native weird" apps={games.filter((a) => ["hextris", "play2048", "proxx", "krunker", "webamp"].includes(a.id) || a.aiBuilt)} />
          <RailRule i={0} />
          <Rail title="Kids can play" apps={games.filter((a) => a.genres.includes("kids"))} />
        </>
      ) : rail === "d" ? (
        AUDIENCES.filter((a) => a.match.includes("games") || a.id === "kids" || a.id === "gamers").map((aud, i) => (
          <div key={aud.id}>
            {i ? <RailRule i={i} /> : null}
            <Rail title={aud.label} apps={games.filter((g) => g.genres.some((x) => aud.match.includes(x)))} />
          </div>
        ))
      ) : rail === "e" ? (
        <ul className="divide-y divide-line">
          {["Action in a tab", "Puzzles", "Kids", "Chess & boards", "Instant arcade"].map((label) => (
            <li key={label} className="py-2 text-[12px]">
              {label}
            </li>
          ))}
        </ul>
      ) : rail === "f" ? (
        <FeatureRail title="Editors' play" apps={games.filter((a) => a.editorsPick)} kind="editors" />
      ) : (
        <>
          <Rail title="Suggested play" apps={games} special />
          <RailRule i={0} />
          <Rail title="Top free-to-open" apps={free} />
          <RailRule i={1} />
          <Rail title="Coming soon on the yard" apps={games.filter((a) => a.comingSoon)} />
        </>
      )}
    </PlayShell>
  );
}
