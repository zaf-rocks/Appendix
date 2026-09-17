import { createFileRoute, Link } from "@tanstack/react-router";
import { PlayShell } from "@/components/play-shell";
import { useCurrentUserState } from "@/lib/auth/use-current-user";
import { authEnabled, signOut } from "@/lib/auth/client";
import { flintBalance } from "@/lib/yard";
import { useEffect, useState } from "react";

export const Route = createFileRoute("/me")({ component: Me });

function Me() {
  const { user, isPending } = useCurrentUserState();
  const [flints, setFlints] = useState(0);
  const [out, setOut] = useState(false);
  useEffect(() => {
    setFlints(flintBalance());
  }, []);

  return (
    <PlayShell heroTitle="YOU" heroLine="Identity, studio, membership, Flints. The crowd is ambient.">
      <p
        className="font-mark mb-3 text-[56px] leading-none tracking-wide [transform:perspective(420px)_rotateX(12deg)] [text-shadow:0_2px_0_#3a2458,0_10px_24px_rgba(0,0,0,0.6)]"
      >
        YOU
      </p>
      <div className="cycle-ccw mb-1" />
      <div className="cycle-cw mb-4" />

      <div className="relative overflow-hidden rounded-2xl ring-1 ring-border">
        <img src="/heroes/you-crowd.jpg" alt="" className="h-28 w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
        {user?.profileImageUrl ? (
          <img
            src={user.profileImageUrl}
            alt=""
            className="absolute bottom-3 left-3 size-14 rounded-full object-cover ring-2 ring-white/40"
          />
        ) : (
          <span className="absolute bottom-3 left-3 grid size-14 place-items-center rounded-full bg-black/60 text-lg font-semibold ring-2 ring-white/40">
            {(user?.displayName || "G").charAt(0).toUpperCase()}
          </span>
        )}
      </div>

      {isPending ? (
        <div className="mt-3 h-16 animate-pulse rounded-xl bg-raised" />
      ) : user ? (
        <dl className="mt-3 grid grid-cols-2 gap-x-3 gap-y-2 text-[12px]">
          <dt className="text-muted">Name</dt>
          <dd>{user.displayName || "—"}</dd>
          <dt className="text-muted">Email</dt>
          <dd className="truncate">{user.primaryEmail || "—"}</dd>
          <dt className="text-muted">Studio</dt>
          <dd>Guest studio</dd>
          <dt className="text-muted">Membership</dt>
          <dd>Base</dd>
          <dt className="text-muted">Flints</dt>
          <dd>{flints}</dd>
          <dt className="text-muted">Sponsored apps</dt>
          <dd>0 active</dd>
        </dl>
      ) : (
        <div className="mt-3">
          <p className="text-[15px] font-semibold">Guest of the Yard</p>
          <p className="mt-1 text-[12px] text-muted">
            Sign in to file apps, claim listings, earn Flints, and keep a studio name on the wall.
          </p>
          <Link to="/login" className="mt-3 inline-flex h-9 items-center rounded-full bg-primary px-4 text-[12px] font-semibold text-primary-fg">
            Sign in
          </Link>
        </div>
      )}

      <ul className="mt-4 divide-y divide-line text-[13px]">
        <Row to="/studio" title="Developer hub" note="File / claim" />
        <Row to="/advertise" title="Sponsor the desk" note="$4.99 / $19.99" />
        <Row to="/beta" title="Critic pool" note="Bench" />
        <Row to="/alerts" title="Alerts tray" note="Pings" />
        <Row to="/saved" title="Bookmarks" note="Stacks" />
        <Row to="/flints" title="Cubicle" note="Desk + Flints" />
      </ul>

      {user && authEnabled ? (
        <button
          type="button"
          disabled={out}
          onClick={() => {
            setOut(true);
            void signOut().catch(() => setOut(false));
          }}
          className="sign-out-3 mt-5 h-10 w-full rounded-full text-[13px] font-semibold"
        >
          {out ? "Signing out…" : "Sign out"}
        </button>
      ) : null}
    </PlayShell>
  );
}

function Row({
  to,
  title,
  note,
}: {
  to: "/studio" | "/beta" | "/alerts" | "/advertise" | "/saved" | "/flints";
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
