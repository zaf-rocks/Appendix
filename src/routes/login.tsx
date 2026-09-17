import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { PlayShell } from "@/components/play-shell";
import { GROK_PROVIDERS, authClient, authEnabled, signIn } from "@/lib/auth/client";

export const Route = createFileRoute("/login")({ component: Login });

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [mode, setMode] = useState<"in" | "up">("in");
  const [err, setErr] = useState<string | null>(null);

  async function onEmail(e: React.FormEvent) {
    e.preventDefault();
    setErr(null);
    try {
      if (mode === "up") {
        const { error } = await authClient.signUp.email({
          email,
          password,
          name: email.split("@")[0] || "Developer",
        });
        if (error) throw new Error(error.message);
      } else {
        const { error } = await authClient.signIn.email({ email, password });
        if (error) throw new Error(error.message);
      }
      window.location.assign("/");
    } catch (ex) {
      setErr(ex instanceof Error ? ex.message : "Sign-in failed");
    }
  }

  return (
    <PlayShell heroTitle="Identity" heroLine="Sign in to file, claim, earn Flints. Guests still browse.">
      <div className="space-y-4">
        <Link to="/" className="text-sm text-muted">
          Back to the scrapyard
        </Link>
        <h1 className="font-display text-2xl font-semibold">Sign in to file an app</h1>
        <p className="text-sm text-muted">
          Guests browse free. Publishing takes an account. Google, X, or email —
          GitHub and Facebook are not on this stack (the door only opens those
          three ways).
        </p>
        {authEnabled ? (
          <>
            {GROK_PROVIDERS.map((p) => (
              <button
                key={p.providerId}
                type="button"
                onClick={() => signIn(p.providerId, { callbackURL: "/" })}
                className="h-12 w-full rounded-full border border-border bg-surface text-sm font-medium hover:bg-raised"
              >
                Continue with {p.label}
              </button>
            ))}
            <p className="text-center text-xs text-subtle">or email</p>
            <form onSubmit={onEmail} className="space-y-2">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@studio.dev"
                className="h-11 w-full rounded-lg border border-border bg-surface px-3"
              />
              <input
                type="password"
                required
                minLength={8}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password (8+)"
                className="h-11 w-full rounded-lg border border-border bg-surface px-3"
              />
              <button type="submit" className="h-12 w-full rounded-full bg-primary font-semibold text-primary-fg">
                {mode === "up" ? "Create account" : "Sign in with email"}
              </button>
            </form>
            <button
              type="button"
              className="w-full text-sm text-muted"
              onClick={() => setMode(mode === "up" ? "in" : "up")}
            >
              {mode === "up" ? "Already have an account?" : "Need an account? Create one"}
            </button>
            {err ? <p className="text-sm text-cat-coral">{err}</p> : null}
          </>
        ) : (
          <p className="text-sm text-muted">Sign-in is warming up.</p>
        )}
      </div>
    </PlayShell>
  );
}
