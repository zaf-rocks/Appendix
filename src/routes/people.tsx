import { createFileRoute, Link } from "@tanstack/react-router";
import { PlayShell } from "@/components/play-shell";
import { Rail } from "@/components/rails";
import { AUDIENCES, CROWD_SUBTYPES } from "@/lib/catalog";
import { listStore } from "@/lib/store-api";
import { useLens } from "@/lib/lens";
import { throughLens } from "@/lib/provenance";
import { cn } from "@/lib/cn";
import { specVars } from "@/lib/spectrum";

type Search = { rail?: string; sub?: string };

export const Route = createFileRoute("/people")({
  validateSearch: (raw: Record<string, unknown>): Search => ({
    rail: typeof raw.rail === "string" ? raw.rail : "gamers",
    sub: typeof raw.sub === "string" ? raw.sub : undefined,
  }),
  loader: () => listStore(),
  component: People,
});

function Chip({
  to,
  search,
  on,
  i,
  children,
}: {
  to: "/people";
  search: Search;
  on: boolean;
  i: number;
  children: string;
}) {
  return (
    <Link
      to={to}
      search={search}
      style={specVars(i + 20)}
      className={cn("spec-pick", on && "spec-pick-on")}
    >
      <span className="spec-pick-face">{children}</span>
    </Link>
  );
}

function People() {
  const catalog = Route.useLoaderData();
  const { lens } = useLens();
  const { rail = "gamers", sub } = Route.useSearch();
  const active = AUDIENCES.find((a) => a.id === rail) ?? AUDIENCES[0];
  const subtypes = CROWD_SUBTYPES[active.id] || [];
  const aisle = throughLens(catalog, lens).filter((app) => app.genres.some((g) => active.match.includes(g)));
  const apps = sub ? aisle.filter((app) => (app.roles || []).includes(sub)) : aisle;
  const plain = AUDIENCES.filter((a) => !CROWD_SUBTYPES[a.id]);
  const nested = AUDIENCES.filter((a) => CROWD_SUBTYPES[a.id]);

  return (
    <PlayShell heroTitle="Crowds" heroLine="Who is this useful to — not what genre the store clerk invented.">
      <div className="-mx-3 flex gap-1 overflow-x-auto px-3 pb-1">
        {plain.map((a, i) => (
          <Chip key={a.id} i={i} to="/people" search={{ rail: a.id }} on={a.id === active.id}>
            {a.label}
          </Chip>
        ))}
      </div>
      <div className="-mx-3 flex gap-1 overflow-x-auto px-3 pb-1">
        {nested.map((a, i) => (
          <Chip key={a.id} i={i + 8} to="/people" search={{ rail: a.id }} on={a.id === active.id}>
            {a.label}
          </Chip>
        ))}
      </div>
      {subtypes.length ? (
        <div className="-mx-3 flex gap-1 overflow-x-auto px-3 pb-1">
          {subtypes.map((s, i) => (
            <Chip
              key={s.id}
              i={i + 16}
              to="/people"
              search={{ rail: active.id, sub: s.id }}
              on={sub === s.id}
            >
              {s.label}
            </Chip>
          ))}
        </div>
      ) : null}
      <p className="mb-2 text-[11px] text-muted">{active.line}</p>
      <Rail title={sub ? subtypes.find((s) => s.id === sub)?.label || active.label : active.label} apps={apps} />
    </PlayShell>
  );
}
