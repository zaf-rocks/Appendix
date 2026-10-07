import { createFileRoute, Link } from "@tanstack/react-router";
import { PlayShell } from "@/components/play-shell";
import { useCurrentUserState } from "@/lib/auth/use-current-user";
import { UserButton } from "@/lib/auth/gates";
import { flintBalance } from "@/lib/yard";
import { useEffect, useState } from "react";

export const Route = createFileRoute("/me")({ component: Me });

function Me() {
  const { user, isPending } = useCurrentUserState();
  const [flints, setFlints] = useState(0);
  useEffect(() => {
    setFlints(flintBalance());
  }, []);

  return (
    <PlayShell heroTitle="You" heroLine="Identity stays here. Flints and Desk live in their own rooms.">
      <div className="rounded-xl bg-[linear-gradient(145deg,#1b1f26,#14171c)] p-4 ring-1 ring-white/10">
        {isPending ? (
          <div className="h-10 animate-pulse rounded-md bg-raised" />
        ) : user ? (
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-[15px] font-semibold">{user.displayName || user.primaryEmail}</p>
              <p className="text-[11px] text-muted">{user.primaryEmail}</p>
            </div>
            <UserButton />
          </div>
        ) : (
          <div>
            <p className="text-[15px] font-semibold">Guest</p>
            <p className="mt-1 text-[12px] text-muted">
              An account unlocks filing apps, claiming listings, Flints, the critic pool, bookmarks,
              beta, Desk, and developer tools after a tiny onboarding. No résumé.
            </p>
            <Link
              to="/login"
              className="mt-3 inline-flex h-9 items-center rounded-full bg-primary px-4 text-[12px] font-semibold text-primary-fg"
            >
              Sign in
            </Link>
          </div>
        )}
      </div>

      <section className="mt-4">
        <p className="text-[10px] tracking-wide text-muted uppercase">Flints on this device</p>
        <p className="mt-1 text-[28px] font-semibold">{flints}</p>
        <p className="text-[11px] text-muted">
          Earned when you sit a Desk ticket and write a real review. Opening a tab does not pay.
        </p>
      </section>

      <ul className="mt-4 divide-y divide-line text-[13px]">
        <Row to="/studio" title="Developer studio" note="File a PWA" />
        <Row to="/advertise" title="Sponsor the desk" note="$4.99 / $19.99" />
        <Row to="/beta" title="Critic pool · Bench" note="Higher Flint reviews" />
        <Row to="/alerts" title="Notifications" note="Claims and desk pings" />
        <Row to="/saved" title="Bookmarks" note="Swipe-saves from Find" />
        <Row to="/contact" title="Contact" note="Press, legal, a reply" />
        <Row to="/flints" title="Flint ledger" note="What you earned" />
      </ul>
    </PlayShell>
  );
}

function Row({
  to,
  title,
  note,
}: {
  to: "/studio" | "/beta" | "/alerts" | "/advertise" | "/saved" | "/flints" | "/contact";
  title: string;
  note: string;
}) {
  return (
    <li>
      <Link to={to} className="flex items-center justify-between py-3">
        <span>{title}</span>
        <span className="text-[11px] text-muted">{note}</span>
      </Link>
    </li>
  );
}
