import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { StoreShell } from "@/components/store-shell";
import { betaCount, joinBeta } from "@/lib/store-api";
import { useCurrentUserState } from "@/lib/auth/use-current-user";

export const Route = createFileRoute("/beta")({
  loader: () => betaCount(),
  component: Beta,
});

function Beta() {
  const { n } = Route.useLoaderData();
  const { user, isPending } = useCurrentUserState();
  const [note, setNote] = useState("");
  const [msg, setMsg] = useState<string | null>(null);

  async function join(e: React.FormEvent) {
    e.preventDefault();
    try {
      await joinBeta({ data: { note } });
      setMsg("You’re on the list. We’ll ping you when a paid listing needs honest eyes.");
    } catch {
      setMsg("Sign in first — testers are people, not ghosts.");
    }
  }

  return (
    <StoreShell>
      <p className="text-xs font-semibold tracking-[0.2em] text-primary uppercase">New world, old courtesy</p>
      <h1 className="font-display mt-2 max-w-xl text-4xl font-semibold tracking-tight">
        Beta testers wanted. Bring a brain, not a sledgehammer.
      </h1>
      <p className="mt-4 max-w-xl text-muted">
        Native stores sand the edges off an app before you ever see it. PWAs
        show up raw. That is the point — and the risk. We need people who will
        click a link, try the thing, and write a critique that is both generous
        and precise. No download. No APK. Five minutes of attention.
      </p>
      <p className="mt-3 text-sm text-fg">{n} testers already volunteered.</p>
      <ul className="mt-6 max-w-xl space-y-2 text-sm text-muted">
        <li>Click the app. Use it. Tell the truth.</li>
        <li>Assume the builder is a human who ships at 2am.</li>
        <li>Scout is anyone who writes. Bench is this pool — paid desk tickets, more Flints.</li>
      </ul>
      {isPending ? (
        <div className="mt-8 h-24 animate-pulse rounded-xl bg-raised" />
      ) : user ? (
        <form onSubmit={join} className="mt-8 max-w-xl space-y-3 rounded-xl bg-surface p-5 ring-1 ring-border">
          <textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="What kinds of apps do you actually use?"
            className="h-24 w-full rounded-lg border border-border bg-bg p-3"
          />
          <button type="submit" className="h-12 w-full rounded-full bg-primary font-semibold text-primary-fg">
            Join the tester pool
          </button>
          {msg ? <p className="text-sm text-muted">{msg}</p> : null}
        </form>
      ) : (
        <p className="mt-8">
          <Link to="/login" className="text-primary">
            Sign in
          </Link>{" "}
          to volunteer. Browsing stays free.
        </p>
      )}
    </StoreShell>
  );
}
