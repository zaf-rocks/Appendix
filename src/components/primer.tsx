import { Link } from "@tanstack/react-router";
import { useRef, useState } from "react";
import { FLINT_BILLBOARD_COST } from "@/lib/yard";
import { cn } from "@/lib/cn";

const CARDS = [
  {
    kicker: "The shelf",
    body: "Web apps you can open right now. No download. A home for people who just started making them, especially amateur vibe coders.",
  },
  {
    kicker: "Post yours",
    body: "Amateurs, professionals, vibe coders, and app builders. Post it here so other people can find it, use it, review it, and tear it apart.",
  },
  {
    kicker: "Flints",
    body: `A real review earns Flints. ${FLINT_BILLBOARD_COST} buy one week in a sponsored slot. Cash can buy that same slot. Flints do not buy stars.`,
  },
] as const;

export function AboutChip({ onOpen }: { onOpen: () => void }) {
  return (
    <button type="button" data-tone="3" onClick={onOpen} className="letter-tab">
      <span className="letter-tab-face">About</span>
    </button>
  );
}

export function Primer({
  signedIn,
  onClose,
  onFile,
}: {
  signedIn: boolean;
  onClose: () => void;
  onFile: () => void;
}) {
  const [i, setI] = useState(0);
  const start = useRef<{ x: number; y: number } | null>(null);

  function onPointerDown(e: React.PointerEvent) {
    start.current = { x: e.clientX, y: e.clientY };
  }

  function onPointerUp(e: React.PointerEvent) {
    if ((e.target as HTMLElement).closest("button, a")) return;
    if (!start.current) return;
    const dx = e.clientX - start.current.x;
    const dy = e.clientY - start.current.y;
    start.current = null;
    if (Math.abs(dx) < 28 && Math.abs(dy) < 28) {
      setI((n) => (n + 1) % CARDS.length);
      return;
    }
    if (Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > 28) {
      setI((n) => (dx < 0 ? Math.min(CARDS.length - 1, n + 1) : Math.max(0, n - 1)));
    }
  }

  return (
    <div className="absolute inset-x-0 bottom-0 z-10 px-2 pb-2">
      <div
        role="region"
        aria-label="About Appendix"
        onPointerDown={onPointerDown}
        onPointerUp={onPointerUp}
        className="relative overflow-hidden rounded-xl bg-[#07040f]/82 p-3 ring-1 ring-white/20 backdrop-blur-md"
        style={{ touchAction: "pan-y" }}
      >
        <button
          type="button"
          aria-label="Close"
          onClick={onClose}
          className="absolute top-1.5 right-1.5 grid size-7 place-items-center rounded-full text-[16px] text-white/80"
        >
          ×
        </button>
        <div className="overflow-hidden pr-6">
          <div
            className="flex w-full motion-reduce:transition-none transition-transform duration-300 ease-out"
            style={{ transform: `translateX(-${i * 100}%)` }}
          >
            {CARDS.map((card, n) => (
              <article key={card.kicker} className="w-full shrink-0 basis-full" aria-hidden={n !== i}>
                <p className="text-[10px] font-semibold tracking-[0.14em] text-white/70 uppercase">{card.kicker}</p>
                <p className="mt-1 min-h-[4.6rem] text-[13px] leading-snug text-white">{card.body}</p>
              </article>
            ))}
          </div>
        </div>
        {i === 1 ? (
          signedIn ? (
            <Link
              to="/studio"
              className="mt-1 inline-flex h-8 items-center rounded-full bg-primary px-3 text-[12px] font-semibold text-primary-fg"
            >
              File an app
            </Link>
          ) : (
            <button
              type="button"
              onClick={onFile}
              className="mt-1 inline-flex h-8 items-center rounded-full bg-primary px-3 text-[12px] font-semibold text-primary-fg"
            >
              File an app
            </button>
          )
        ) : null}
        {i === 2 ? (
          <button
            type="button"
            onClick={onClose}
            className="mt-1 inline-flex h-8 items-center rounded-full bg-white px-3 text-[12px] font-semibold text-black"
          >
            Got it
          </button>
        ) : null}
        <div className="mt-2 flex items-center gap-1.5">
          {CARDS.map((card, n) => (
            <button
              key={card.kicker}
              type="button"
              aria-label={`Card ${n + 1}`}
              aria-current={n === i}
              onClick={() => setI(n)}
              className="grid size-4 place-items-center"
            >
              <span className={cn("size-1.5 rounded-full", n === i ? "bg-white" : "bg-white/35")} />
            </button>
          ))}
          <span className="ml-1 text-[10px] text-white/55">
            {i + 1} / {CARDS.length}
          </span>
        </div>
      </div>
    </div>
  );
}
