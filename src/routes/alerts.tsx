import { createFileRoute, Link } from "@tanstack/react-router";
import { PlayShell } from "@/components/play-shell";
import { useCurrentUserState } from "@/lib/auth/use-current-user";

export const Route = createFileRoute("/alerts")({ component: Alerts });

function Alerts() {
  const { user, isPending } = useCurrentUserState();
  return (
    <PlayShell heroTitle="Alerts" heroLine="Claims, desk tickets, soon-listings that woke up.">
      {isPending ? (
        <div className="h-20 animate-pulse rounded-xl bg-raised" />
      ) : user ? (
        <ul className="divide-y divide-line text-[13px]">
          <li className="py-3">
            <p className="font-medium">You’re signed in</p>
            <p className="text-[12px] text-muted">
              This tray catches three things: (1) someone requested to claim an app, (2) a Desk
              ticket is waiting, (3) a coming-soon listing got a live URL.
            </p>
          </li>
          <li className="py-3 text-muted">
            No live pings yet. When a maker files a claim or buys a desk seat, it lands here.
          </li>
        </ul>
      ) : (
        <p className="text-[13px] text-muted">
          Sign in to keep alerts.{" "}
          <Link to="/login" className="text-primary">
            Sign in
          </Link>
        </p>
      )}
    </PlayShell>
  );
}
