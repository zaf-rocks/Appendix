import { Link, useRouterState } from "@tanstack/react-router";
import { Bell, Bookmark, Coins, Factory, Gamepad2, House, Search, Users, CircleUser } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { FileChip, FileSlip } from "@/components/file-door";
import { AboutChip, Primer } from "@/components/primer";
import { useCurrentUserState } from "@/lib/auth/use-current-user";
import { SEED } from "@/lib/catalog";
import { useLens } from "@/lib/lens";
import { throughLens } from "@/lib/provenance";
import { specVars } from "@/lib/spectrum";
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
  if (path === "/") return { mp4: "/heroes/home-anarchy.mp4", poster: "/heroes/home-anarchy.jpg" };
  if (path === "/games") return { mp4: "/heroes/games.mp4", poster: "/heroes/games.jpg" };
  if (path === "/flints" || path === "/desk") return { mp4: "/heroes/desk.mp4", poster: "/heroes/desk.jpg" };
  if (path === "/people") return { mp4: "/heroes/home-d.mp4", poster: "/heroes/home-d.jpg" };
  if (path === "/saved") return { mp4: "/heroes/bookmarks.mp4", poster: "/heroes/bookmarks.jpg" };
  if (path === "/find" || path === "/forge" || path === "/census")
    return { mp4: "/heroes/home-e.mp4", poster: "/heroes/home-e.jpg" };
  return { mp4: "/heroes/home-a.mp4", poster: "/heroes/home-a.jpg" };
}

function tabOn(to: string, path: string) {
  if (to === "/") return path === "/";
  if (to === "/forge") return path === "/forge" || path === "/census";
  return path === to || path.startsWith(`${to}/`);
}

function LensCaption() {
  const { lens } = useLens();
  return <p className="lens-caption">{lens === "vibe" ? "Vibe-coded now" : "Double-tap Home for vibe"}</p>;
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
  const { lens, setLens } = useLens();
  const path = useRouterState({ select: (s) => s.location.pathname });
  const [fileOpen, setFileOpen] = useState(false);
  const [primer, setPrimer] = useState<"wait" | "on" | "off">("wait");
  const drum = useRef<number[]>([]);
  const markRef = useRef<HTMLButtonElement>(null);
  const homeTap = useRef(0);
  const hero = heroFor(path);
  const home = path === "/";
  const identOn = ["/me", "/studio", "/beta", "/advertise", "/login"].includes(path);
  const flintsOn = path === "/flints" || path === "/desk";
  const savedOn = path === "/saved";
  const alertsOn = path === "/alerts";
  const letter = (user?.displayName || user?.primaryEmail || "").trim().charAt(0).toUpperCase();
  const n = throughLens(SEED, lens).length;
  const hideFile = path === "/login" || path === "/studio" || path === "/well" || path.startsWith("/app/");

  useEffect(() => {
    setFileOpen(false);
  }, [path]);

  useEffect(() => {
    try {
      setPrimer(localStorage.getItem("appendix-primer-seen") === "1" ? "off" : "on");
    } catch {
      setPrimer("on");
    }
  }, []);

  function dismissPrimer() {
    try {
      localStorage.setItem("appendix-primer-seen", "1");
    } catch {
      /* private mode */
    }
    setPrimer("off");
  }

  function openFileSlip() {
    setFileOpen(true);
    requestAnimationFrame(() => {
      document.getElementById("file-slip")?.scrollIntoView({ behavior: "smooth", block: "nearest" });
    });
  }

  useEffect(() => {
    const el = markRef.current;
    if (!el) return;
    const onDown = () => {
      const now = Date.now();
      drum.current = drum.current.filter((t) => now - t < 5000);
      drum.current.push(now);
      if (drum.current.length >= 20) {
        drum.current = [];
        window.location.assign("/well");
      }
    };
    el.addEventListener("pointerdown", onDown);
    return () => el.removeEventListener("pointerdown", onDown);
  }, []);

  return (
    <div className="min-h-dvh bg-bg text-fg">
      <header className={cn("hero-band relative", home && primer === "on" && "hero-band-primer")}>
        <div className="absolute inset-0 overflow-hidden">
        <video
          key={hero.mp4}
          className="absolute inset-0 size-full object-cover object-[center_32%] pointer-events-none"
          autoPlay
          muted
          loop
          playsInline
          poster={hero.poster}
        >
          <source src={hero.mp4} type="video/mp4" />
        </video>
        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(10,6,32,0.22)_0%,rgba(8,4,24,0.02)_36%,rgba(8,4,22,0.42)_70%,rgba(5,1,12,0.94)_100%)]" />
        <div className="hero-sill pointer-events-none absolute inset-x-0 bottom-0" />
        </div>
        <div className="absolute inset-x-0 top-0 z-10 flex items-start gap-2 px-3 pt-2.5">
          <div className="flex items-start gap-1.5">
            <button
              ref={markRef}
              type="button"
              tabIndex={-1}
              aria-hidden
              className="hero-lift size-[3.7rem] shrink-0 rounded-[10px] p-0"
            >
              <img
                src="/mark-a.jpg?v=lit"
                alt=""
                draggable={false}
                className="size-full rounded-[10px] object-cover"
              />
            </button>
            <div className="flex w-fit flex-col items-center">
              <Link to="/" className="block">
                <span
                  className={cn(
                    "hero-mark font-mark text-3d inline-block text-[22px] leading-none tracking-wide",
                    lens === "vibe" ? "hero-mark-vibe" : "hero-mark-all",
                  )}
                >
                  Appendix
                </span>
              </Link>
              <LensCaption />
            </div>
          </div>
          <div className="ml-auto flex items-center gap-2.5 pt-0.5">
            <Link
              to="/saved"
              className={cn("bookmark-btn bookmark-btn-sm", savedOn && "bookmark-btn-on")}
              aria-label="Bookmarks"
            >
              <span className="bookmark-btn-face">
                <Bookmark className="bookmark-btn-icon" />
              </span>
            </Link>
            <Link
              to="/flints"
              className={cn(
                "hero-lift grid size-9 place-items-center rounded-full ring-1 backdrop-blur",
                flintsOn ? "bg-get text-get-fg ring-white/50" : "bg-black/50 text-get ring-white/20",
              )}
              aria-label="Flints"
            >
              <Coins className="size-4" />
            </Link>
            <Link
              to="/alerts"
              className={cn(
                "hero-lift relative grid size-9 place-items-center rounded-full ring-1 backdrop-blur",
                alertsOn ? "bg-primary text-primary-fg ring-white/50" : "bg-black/50 text-primary ring-white/20",
              )}
              aria-label="Alerts"
            >
              <Bell className="size-4" />
            </Link>
            <Link
              to="/me"
              className={cn("ident-ring-vivid hero-lift grid size-[3.7rem] place-items-center overflow-hidden rounded-full p-[2px]")}
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
        {home && primer === "on" ? (
          <Primer signedIn={Boolean(user)} onClose={dismissPrimer} onFile={openFileSlip} />
        ) : (
        <div className="absolute inset-x-0 bottom-2.5 z-10 flex items-baseline justify-between gap-2 pl-3 pr-0">
          {home && (rail || "a") === "a" ? (
            <p className="hero-count shrink-0">
              {n.toLocaleString()} {lens === "vibe" ? "Vibe Apps" : "Web Apps"}
            </p>
          ) : !home ? (
            <p className="bookmark-hero-title shrink-0">{heroTitle || ""}</p>
          ) : (
            <span />
          )}
          {home ? (
            <p className="hero-tag min-w-0 flex-1 truncate text-right">Putting the Progressive in Progressive Web App</p>
          ) : (
            <p className={cn("hero-tag min-w-0 flex-1 truncate text-right", savedOn && "bookmark-hero-tag")}>{heroLine || ""}</p>
          )}
        </div>
        )}
      </header>

      {letters ? (
        <>
          <div className="no-bar flex gap-1 overflow-x-auto px-2 pt-1 pb-0">
          {hideFile ? null : (
            <FileChip signedIn={Boolean(user)} open={fileOpen} onOpen={() => setFileOpen((v) => !v)} />
          )}
          {home && primer === "off" ? <AboutChip onOpen={() => setPrimer("on")} /> : null}
          {LETTERS.map((l, i) => (
            <Link
              key={l.id}
              to={path === "/games" ? "/games" : "/"}
              search={{ rail: l.id }}
              data-tone={String((i % 3) + 1)}
              style={specVars(i)}
              className={cn("letter-tab", (rail || "a") === l.id && "letter-tab-on")}
            >
              <span className="letter-tab-face">{l.label}</span>
            </Link>
          ))}
        </div>
          <div className="hero-sill hero-sill-b mt-1.5" />
        </>
      ) : hideFile ? null : (
        <div className="no-bar flex gap-1 overflow-x-auto px-2 pt-1 pb-1">
          <FileChip signedIn={Boolean(user)} open={fileOpen} onOpen={() => setFileOpen((v) => !v)} />
        </div>
      )}

      {fileOpen && !user && !hideFile ? <FileSlip /> : null}

      <main className="px-3 pt-0 pb-36">{children}</main>

      <nav className="fixed inset-x-0 bottom-0 z-30 border-t border-line bg-bg/95 backdrop-blur">
        <div className="mx-auto grid w-full max-w-3xl grid-cols-5 items-center pt-1 text-[10px] text-muted">
          <span />
          <Link to="/contact" className="justify-self-end">
            Contact
          </Link>
          <span className="nav-mark justify-self-center" aria-hidden>
            ※
          </span>
          <Link to="/me" className="justify-self-start">
            Account
          </Link>
          <span />
        </div>
        <div className="mx-auto grid w-full max-w-3xl grid-cols-5 px-1 pb-[env(safe-area-inset-bottom)]">
          {TABS.map((t) => {
            const on = tabOn(t.to, path);
            const Icon = t.icon;
            const homeTab = t.to === "/";
            return (
              <Link
                key={t.to}
                to={t.to}
                onClick={(e) => {
                  if (!homeTab || path !== "/") return;
                  e.preventDefault();
                  const now = Date.now();
                  if (now - homeTap.current < 480) {
                    homeTap.current = 0;
                    setLens(lens === "vibe" ? "all" : "vibe");
                  } else {
                    homeTap.current = now;
                  }
                }}
                className={cn("flex flex-col items-center gap-1 py-3 text-[11px]", on ? "text-fg" : "text-muted")}
              >
                <span
                  className={cn(
                    "grid size-11 place-items-center rounded-2xl",
                    on ? (homeTab && lens === "vibe" ? "nebula-fill nebula-cycle p-[2px]" : "ident-ring p-[2px]") : "bg-raised",
                  )}
                >
                  <span className={cn("relative grid size-full place-items-center rounded-[14px]", on ? "bg-bg" : "")}>
                    <Icon className="size-5" />
                    {homeTab ? <span className="home-twice">2×</span> : null}
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
