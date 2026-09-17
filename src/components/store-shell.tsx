import { cn } from "@/lib/cn";
import { PlayShell } from "@/components/play-shell";
import { listingStatus, type AppEntry } from "@/lib/catalog";

export { AppIcon } from "@/components/app-icon";

export function StoreShell({ children }: { children: React.ReactNode }) {
  return <PlayShell>{children}</PlayShell>;
}

export function StatusDot({ app, up }: { app?: AppEntry; up?: boolean }) {
  const s = app ? listingStatus(app) : up ? "live" : "dead";
  return (
    <span
      className={cn(
        "inline-block size-1.5 shrink-0 rounded-full",
        s === "live" ? "bg-get" : s === "soon" ? "bg-soon" : "bg-down",
      )}
      title={s === "live" ? "Live" : s === "soon" ? "Coming soon" : "Unavailable"}
    />
  );
}
