import { createFileRoute, Link } from "@tanstack/react-router";
import { PlayShell } from "@/components/play-shell";

export const Route = createFileRoute("/advertise")({ component: Advertise });

const PLANS = [
  {
    name: "Home tile",
    price: "$4.99/mo",
    line: "Sponsored rail on Home. You show up more often. Queue is still the slow line.",
  },
  {
    name: "Desk pass",
    price: "$19.99/mo",
    line: "Unlimited tickets on The Desk. Critics are paid to sit with your PWA. Faster review queue.",
  },
  {
    name: "Floor",
    price: "$199/mo",
    line: "Billboard + Desk + first look when we add hero ads. For people who want the yard loud.",
  },
];

function Advertise() {
  return (
    <PlayShell heroTitle="Sponsor the yard" heroLine="You’re not buying a download. You’re buying eyes and honest sit-downs.">
      <p className="text-[13px] text-muted">
        The Desk is three chairs, always. Two from the paid pool, one from the yard.
        $4.99/mo buys a sponsored Home tile. $19.99/mo puts you in the Desk pool.
        Flints redeem a week of that visibility. Paying buys eyes, not stars.
      </p>
      <ul className="mt-4 space-y-3">
        {PLANS.map((p) => (
          <li key={p.name} className="rounded-xl bg-surface p-4 ring-1 ring-border">
            <p className="text-[11px] tracking-wide text-muted uppercase">{p.name}</p>
            <p className="mt-1 text-[22px] font-semibold">{p.price}</p>
            <p className="mt-1 text-[12px] text-muted">{p.line}</p>
          </li>
        ))}
      </ul>
      <p className="mt-4 text-[12px] text-muted">
        File the app in{" "}
        <Link to="/studio" className="text-primary">
          Developer studio
        </Link>{" "}
        first. Then we put it on the desk.
      </p>
    </PlayShell>
  );
}
