import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { PlayShell } from "@/components/play-shell";
import { useCurrentUserState } from "@/lib/auth/use-current-user";

export const Route = createFileRoute("/alerts")({ component: Alerts });

function Alerts() {
  const { user, isPending } = useCurrentUserState();
  const [news, setNews] = useState(false);
  return (
    <PlayShell heroTitle="Alerts" heroLine="Welcome pings, review status, Flint verification. The tray, not the firehose.">
      {isPending ? (
        <div className="h-20 animate-pulse rounded-xl bg-raised" />
      ) : (
        <ul className="divide-y divide-line text-[13px]">
          <li className="py-3">
            <p className="font-medium">Welcome to the yard</p>
            <p className="text-[12px] text-muted">Daily: claims, desk tickets, coming-soon listings that woke up.</p>
          </li>
          <li className="py-3">
            <p className="font-medium">Reviews</p>
            <p className="text-[12px] text-muted">Reviewed vs pending. Nothing pending.</p>
          </li>
          <li className="py-3">
            <p className="font-medium">Flint verification</p>
            <p className="text-[12px] text-muted">When a contribution clears, it lands here. Empty is honest.</p>
          </li>
        </ul>
      )}
      <label className="mt-4 flex items-center gap-2 text-[12px]">
        <input type="checkbox" checked={news} onChange={(e) => setNews(e.target.checked)} />
        Monthly newsletter — early access to competitions
      </label>
      {!user && !isPending ? (
        <p className="mt-3 text-[12px] text-muted">
          <Link to="/login" className="text-primary">
            Sign in
          </Link>{" "}
          to keep the tray attached to you.
        </p>
      ) : null}
    </PlayShell>
  );
}
