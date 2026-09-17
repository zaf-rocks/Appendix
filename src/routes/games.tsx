import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
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

function MiniMaker() {
  const [prompt, setPrompt] = useState("");
  const [out, setOut] = useState<string | null>(null);
  return (
    <section className="mb-4 rounded-xl bg-surface p-3 ring-1 ring-border">
      <h2 className="special-bar">Vibe a 16-bit toy</h2>
      <p className="mt-1 text-[11px] text-muted">
        Frogger energy, not Unreal. Describe a tiny arcade. We stub a listing. Remix means anyone can
        borrow the prompt and ship their own cut. No physics engine this pass.
      </p>
      <textarea
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        placeholder="A frog crosses a neon highway of shopping carts…"
        className="mt-2 h-16 w-full rounded-md border border-border bg-bg p-2 text-[12px]"
      />
      <button
        type="button"
        onClick={() => {
          if (prompt.trim().length < 8) return;
          const stub = JSON.stringify({ prompt: prompt.trim(), era: "16-bit", openSource: true }, null, 2);
          try {
            const prev = JSON.parse(localStorage.getItem("appendix-minigames") || "[]") as unknown[];
            localStorage.setItem("appendix-minigames", JSON.stringify([{ prompt: prompt.trim(), at: Date.now() }, ...prev].slice(0, 20)));
          } catch {
            /* ignore */
          }
          setOut(stub);
        }}
        className="mt-2 h-8 rounded-full bg-get px-3 text-[12px] font-semibold text-get-fg"
      >
        Save prototype prompt
      </button>
      {out ? <pre className="mt-2 overflow-auto text-[10px] text-muted">{out}</pre> : null}
    </section>
  );
}

function Games() {
  const catalog = throughLens(Route.useLoaderData(), useLens().lens);
  const { rail = "a" } = Route.useSearch();
  const games = catalog.filter((a) => a.genres.includes("games"));
  const free = games.filter((a) => !a.paid);

  return (
    <PlayShell letters rail={rail} heroTitle="Games" heroLine="No APK. No store clerk. Just a tab that wants to play.">
      {rail === "a" ? <MiniMaker /> : null}
      {rail === "b" ? (
        <>
          <h2 className="text-[10px] font-medium tracking-wide text-muted uppercase">Top opens</h2>
          <RankList apps={free} swipe />
        </>
      ) : rail === "c" ? (
        <>
          <Rail title="Browser-native weird" apps={games.filter((a) => ["hextris", "play2048", "proxx", "krunker", "webamp"].includes(a.id) || a.aiBuilt)} />
          <RailRule />
          <Rail title="Kids can play" apps={games.filter((a) => a.genres.includes("kids"))} />
        </>
      ) : rail === "d" ? (
        AUDIENCES.filter((a) => a.match.includes("games") || a.id === "kids" || a.id === "gamers").map((aud, i) => (
          <div key={aud.id}>
            {i ? <RailRule /> : null}
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
          <RailRule />
          <Rail title="Top free-to-open" apps={free} />
          <RailRule />
          <Rail title="Coming soon on the yard" apps={games.filter((a) => a.comingSoon)} />
        </>
      )}
    </PlayShell>
  );
}
