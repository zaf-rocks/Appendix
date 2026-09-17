import { createFileRoute, Link } from "@tanstack/react-router";
import { PlayShell } from "@/components/play-shell";
import { Rail } from "@/components/rails";
import { listStore } from "@/lib/store-api";

export const Route = createFileRoute("/maker/$slug")({
  loader: ({ params }) => listStore().then((catalog) => ({ catalog, slug: params.slug })),
  component: Maker,
});

function Maker() {
  const { catalog, slug } = Route.useLoaderData();
  const name = decodeURIComponent(slug);
  const apps = catalog.filter((a) => a.developer === name);
  const platforms = [...new Set(apps.map((a) => a.platform).filter(Boolean))];

  return (
    <PlayShell heroTitle={name} heroLine="A maker on the yard. Message and tip stay inside Appendix.">
      <p className="text-[12px] text-muted">
        {apps.length} listing{apps.length === 1 ? "" : "s"}
        {platforms.length ? ` · built with ${platforms.join(", ")}` : ""}
      </p>
      <div className="mt-3 flex gap-2">
        <button type="button" className="h-8 rounded-full bg-raised px-3 text-[12px] ring-1 ring-border">
          Message
        </button>
        <button type="button" className="h-8 rounded-full bg-raised px-3 text-[12px] ring-1 ring-border">
          Tip 11.7%
        </button>
      </div>
      <p className="mt-2 text-[11px] text-muted">
        Tipping is scaffolded. No processor is live. 11.7% is the yard’s cut when it is.
      </p>
      <div className="mt-4">
        <Rail title="Apps" apps={apps} />
      </div>
      <Link to="/" className="mt-4 inline-block text-[12px] text-primary">
        Back to the yard
      </Link>
    </PlayShell>
  );
}
