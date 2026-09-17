import { createFileRoute, Link } from "@tanstack/react-router";
import { PlayShell } from "@/components/play-shell";
import { RankList } from "@/components/rails";
import { GENRE_META, GENRES_ALPHA, type Genre } from "@/lib/catalog";
import { listStore } from "@/lib/store-api";
import { useLens } from "@/lib/lens";
import { throughLens } from "@/lib/provenance";

const SUB: Partial<Record<Genre, string[]>> = {
  games: ["Puzzle", "Arcade", "Board", "Idle"],
  music: ["Make", "Listen", "Karaoke"],
  photo: ["Edit", "Shoot", "Share"],
  education: ["Classroom", "Self-teach", "Kids"],
  productivity: ["Notes", "Boards", "Timers"],
  social: ["Chat", "Rooms", "Feed"],
  tools: ["Dev", "Convert", "Utilities"],
  business: ["Ops", "Clients", "Internal"],
};

export const Route = createFileRoute("/category/$genre")({
  loader: ({ params }) => listStore().then((catalog) => ({ catalog, genre: params.genre as Genre })),
  component: CategoryPage,
});

function CategoryPage() {
  const { catalog, genre } = Route.useLoaderData();
  const apps = throughLens(catalog, useLens().lens).filter((a) => a.genres.includes(genre));
  const meta = GENRE_META[genre];
  const subs = SUB[genre] || [];

  return (
    <PlayShell heroTitle={meta?.label || genre} heroLine={meta?.hint || "The aisle."}>
      {subs.length ? (
        <p className="mb-2 text-[11px] text-muted">Subcategories: {subs.join(" · ")}</p>
      ) : null}
      <RankList apps={apps} swipe />
      <p className="mt-4 text-[11px] text-muted">A–Z of the yard</p>
      <ul className="mt-1 columns-2 text-[12px]">
        {GENRES_ALPHA.map((g) => (
          <li key={g} className="break-inside-avoid py-1">
            <Link to="/category/$genre" params={{ genre: g }} className={g === genre ? "text-primary" : ""}>
              {GENRE_META[g].label}
            </Link>
          </li>
        ))}
      </ul>
    </PlayShell>
  );
}
