import { cn } from "@/lib/cn";

const PALETTES = [
  ["#ff5a3d", "#ff2d78"],
  ["#2ee59d", "#1a8cff"],
  ["#ffb020", "#ff5e3a"],
  ["#7b5cff", "#2ec5ff"],
  ["#ff4d9d", "#7b4dff"],
  ["#3dffb0", "#00c2ff"],
  ["#ffd14a", "#ff7a1a"],
  ["#5b8cff", "#b44dff"],
];

function hash(s: string) {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h * 33 + s.charCodeAt(i)) >>> 0;
  return h;
}

export function AppIcon({
  name,
  iconUrl,
  className,
}: {
  name: string;
  iconUrl?: string;
  tone?: string;
  className?: string;
}) {
  const h = hash(name);
  const [a, b] = PALETTES[h % PALETTES.length];
  const shape = h % 4;

  if (iconUrl) {
    return (
      <img
        src={iconUrl}
        alt=""
        className={cn(
          "size-11 shrink-0 rounded-[22%] bg-raised object-cover shadow-[0_8px_16px_rgba(0,0,0,0.45),inset_0_1px_0_rgba(255,255,255,0.25)]",
          className,
        )}
      />
    );
  }

  return (
    <div
      className={cn(
        "relative grid size-11 shrink-0 place-items-center overflow-hidden rounded-[22%] text-[11px] font-semibold text-white",
        className,
      )}
      style={{
        background: `linear-gradient(145deg, ${a}, ${b})`,
        boxShadow: `0 10px 18px rgba(0,0,0,0.5), inset 0 2px 0 rgba(255,255,255,0.45), inset 0 -8px 14px rgba(0,0,0,0.28)`,
      }}
    >
      <span className="absolute inset-0 bg-[linear-gradient(180deg,rgba(255,255,255,0.38),transparent_46%)]" />
      <span className="absolute -bottom-3 left-1/2 size-8 -translate-x-1/2 rounded-full bg-black/25 blur-md" />
      {shape === 0 ? (
        <span className="size-4 rounded-full bg-white/25" />
      ) : shape === 1 ? (
        <span className="size-3.5 rotate-45 rounded-[3px] bg-white/25" />
      ) : shape === 2 ? (
        <span className="h-0 w-0 border-x-[7px] border-b-[12px] border-x-transparent border-b-white/25" />
      ) : (
        <span className="grid grid-cols-2 gap-0.5">
          <span className="size-1.5 rounded-[2px] bg-white/30" />
          <span className="size-1.5 rounded-[2px] bg-white/20" />
          <span className="size-1.5 rounded-[2px] bg-white/20" />
          <span className="size-1.5 rounded-[2px] bg-white/30" />
        </span>
      )}
      <span className="relative drop-shadow">{name.slice(0, 2).toUpperCase()}</span>
    </div>
  );
}
