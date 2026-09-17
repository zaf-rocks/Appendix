import { Link, useRouterState } from "@tanstack/react-router";
import { Bell, Bookmark, Coins, Factory, Gamepad2, House, Search, Users, CircleUser } from "lucide-react";
import { useCurrentUserState } from "@/lib/auth/use-current-user";
import { SEED } from "@/lib/catalog";
import { useLens } from "@/lib/lens";
import { throughLens } from "@/lib/provenance";
import { cn } from "@/lib/cn";

const LETTERS = [
  { id: "a", label: "Suggested" },
  { id: "b", label: "Top charts" },
  { id: "c", label: "Unconventional" },
  { id: "d", label: "For crowds" },
  { id: "e", label: "Categories" },
  { id: "f", label: "Editors' Choice" },
] as const;

const TABS = [
  { to: "/", label: "Home", icon: House },
  { to: "/people", label: "Crowds", icon: Users },
  { to: "/find", label: "Find", icon: Search },
  { to: "/games", label: "Games", icon: Gamepad2 },
  { to: "/forge", label: "Forge", icon: Factory },
] as const;

function heroFor(path: string) {
  if (path === "/") return { mp4: "/heroes/home-monument.mp4", poster: "/heroes/home-monument.jpg" };
  if (path === "/games") return { mp4: "/heroes/games.mp4", poster: "/heroes/games.jpg" };
  if (path === "/flints" || path === "/desk") return { mp4: "/heroes/desk.mp4", poster: "/heroes/desk.jpg" };
  if (path === "/people") return { mp4: "/heroes/home-d.mp4", poster: "/heroes/home-d.jpg" };
  if (path === "/find" || path === "/saved" || path === "/forge" || path === "/census")
    return { mp4: "/heroes/home-e.mp4", poster: "/heroes/home-e.jpg" };
  return { mp4: "/heroes/home-a.mp4", poster: "/heroes/home-a.jpg" };
}

function tabOn(to: string, path: string) {
  if (to === "/") return path === "/";
  if (to === "/forge") return path === "/forge" || path === "/census";
  return path === to || path.startsWith(`${to}/`);
}

function LensToggle() {
  const { lens, setLens } = useLens();
  return (
    <div className="mt-1 w-full">
      <div className="flex h-[22px] w-full rounded-full bg-black/45 p-[2px] text-[9px] font-semibold tracking-wide ring-1 ring-white/25">
        {(["vibe", "all"] as const).map((l) => (
          <button
            key={l}
            type="button"
            onClick={() => setLens(l)}
            className={cn(
              "h-full flex-1 rounded-full uppercase",
              lens === l ? (l === "vibe" ? "vibe-grad text-black" : "all-grad gold-sheen text-black") : "text-white/70",
            )}
          >
            {l}
          </button>
        ))}
      </div>
      <p className="mt-0.5 text-[8px] text-white/65">{lens === "vibe" ? "Vibe-coded PWAs" : "Every PWA we index"}</p>
    </div>
  );
}

export function PlayShell({
  children,
  letters,
  rail,
  heroTitle,
  heroLine,
}: {
  children: React.ReactNode;
  letters?: boolean;
  rail?: string;
  heroTitle?: string;
  heroLine?: string;
}) {
  const { user, isPending } = useCurrentUserState();
  const { lens } = useLens();
  const path = useRouterState({ select: (s) => s.location.pathname });
  const hero = heroFor(path);
  const home = path === "/";
  const identOn = ["/me", "/studio", "/beta", "/advertise", "/login"].includes(path);
  const flintsOn = path === "/flints" || path === "/desk";
  const savedOn = path === "/saved";
  const alertsOn = path === "/alerts";
  const letter = (user?.displayName || user?.primaryEmail || "").trim().charAt(0).toUpperCase();
  const n = throughLens(SEED, lens).length;

  return (
    <div className="min-h-dvh bg-bg text-fg">
      <header className="relative aspect-[2.4/1] max-h-[220px] min-h-[128px] overflow-hidden">
        <video
          key={hero.mp4}
          className="absolute inset-0 size-full object-cover"
          autoPlay
          muted
          loop
          playsInline
          poster={hero.poster}
        >
          <source src={hero.mp4} type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(8,10,12,0.28)_0%,rgba(8,10,12,0.08)_42%,rgba(12,14,17,0.82)_100%)]" />
        <div className="absolute inset-x-0 top-0 z-10 flex items-start gap-2 px-3 pt-2.5">
          <div className="flex items-start gap-1.5">
            <img
              src="/mark-a.jpg"
              alt=""
              className="size-[3.35rem] shrink-0 rounded-[10px] object-cover ring-1 ring-white/25"
            />
            <div className="w-fit">
              <Link to="/" className="block">
                <span className="font-mark inline-block text-[22px] leading-none tracking-wide text-white [transform:perspective(420px)_rotateX(12deg)] [text-shadow:0_1px_0_#8a7a5a,0_2px_0_#3a3224,0_8px_16px_rgba(0,0,0,0.55)]">
                  Appendix
                </span>
              </Link>
              <LensToggle />
            </div>
          </div>
          <div className="ml-auto flex items-center gap-3 pt-0.5">
            <Link
              to="/saved"
              className={cn(
                "grid size-11 place-items-center rounded-full ring-1 backdrop-blur",
                savedOn ? "bg-cat-amber text-black ring-white/50" : "bg-black/50 text-cat-amber ring-white/20",
              )}
              aria-label="Bookmarks"
            >
              <Bookmark className={cn("size-5", savedOn ? "fill-black" : "")} />
            </Link>
            <Link
              to="/flints"
              className={cn(
                "grid size-11 place-items-center rounded-full ring-1 backdrop-blur",
                flintsOn ? "bg-get text-get-fg ring-white/50" : "bg-black/50 text-get ring-white/20",
              )}
              aria-label="Flints"
            >
              <Coins className="size-5" />
            </Link>
            <Link
              to="/alerts"
              className={cn(
                "relative grid size-11 place-items-center rounded-full ring-1 backdrop-blur",
                alertsOn ? "bg-primary text-primary-fg ring-white/50" : "bg-black/50 text-primary ring-white/20",
              )}
              aria-label="Alerts"
            >
              <Bell className="size-5" />
            </Link>
            <Link
              to="/me"
              className={cn("ident-ring grid size-[3.35rem] place-items-center overflow-hidden rounded-full p-[2px]")}
              aria-label="Identity"
            >
              <span
                className={cn(
                  "grid size-full place-items-center rounded-full text-[13px] font-semibold",
                  identOn ? "bg-[#16181c] ring-2 ring-white/70" : "bg-[#16181c]",
                )}
              >
                {isPending ? "…" : user ? letter || <CircleUser className="size-5" /> : <CircleUser className="size-5" />}
              </span>
            </Link>
          </div>
        </div>
        {home ? (
          <p className="hero-tag absolute right-3 bottom-2 max-w-[52vw] text-right italic text-white/92">
            Putting the Progressive in Progressive Web App.
          </p>
        ) : (
          <div className="absolute inset-x-0 bottom-2 px-3">
            <p className="font-display text-[18px] leading-none font-semibold tracking-tight [transform:perspective(380px)_rotateX(10deg)] [text-shadow:0_1px_0_#6a5a40,0_6px_14px_rgba(0,0,0,0.55)]">
              {heroTitle || ""}
            </p>
            <p className="mt-1 max-w-[46ch] text-[10px] text-white/75">{heroLine || ""}</p>
          </div>
        )}
      </header>

      <div className="flex items-end justify-between px-3 pt-1.5 pb-1">
        <p className="text-[10px] tracking-wide text-muted uppercase">
          {n.toLocaleString()} {lens === "vibe" ? "Vibe Apps" : "All Apps"}
        </p>
      </div>

      {letters ? (
        <div className="flex gap-1 overflow-x-auto px-2 py-1.5">
          {LETTERS.map((l) => (
            <Link
              key={l.id}
              to={path === "/games" ? "/games" : "/"}
              search={{ rail: l.id }}
              className={cn(
                "h-6 shrink-0 rounded-full px-2.5 text-[10px] leading-6 whitespace-nowrap",
                (rail || "a") === l.id ? "bg-fg text-bg" : "bg-raised text-muted",
              )}
            >
              {l.label}
            </Link>
          ))}
        </div>
      ) : null}

      <main className="px-3 pt-2 pb-24">{children}</main>

      <nav className="fixed inset-x-0 bottom-0 z-30 border-t border-line bg-bg/95 backdrop-blur">
        <div className="mx-auto grid w-full max-w-3xl grid-cols-5 px-1 pb-[env(safe-area-inset-bottom)]">
          {TABS.map((t) => {
            const on = tabOn(t.to, path);
            const Icon = t.icon;
            return (
              <Link
                key={t.to}
                to={t.to}
                className={cn("flex flex-col items-center gap-1 py-3 text-[11px]", on ? "text-fg" : "text-muted")}
              >
                <span className={cn("grid size-11 place-items-center rounded-2xl", on ? "ident-ring p-[2px]" : "bg-raised")}>
                  <span className={cn("grid size-full place-items-center rounded-[14px]", on ? "bg-bg" : "")}>
                    <Icon className="size-5" />
                  </span>
                </span>
                {t.label}
              </Link>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
