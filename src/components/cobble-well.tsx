import { useEffect, useRef, useState } from "react";

const NEED = 16;

export function CobbleWell() {
  const [open, setOpen] = useState(false);
  const n = useRef(0);
  const last = useRef(0);

  useEffect(() => {
    function onWheel(e: WheelEvent) {
      if (open) return;
      const el = document.documentElement;
      const atBottom = el.scrollHeight - el.scrollTop - el.clientHeight < 8;
      if (!atBottom || e.deltaY <= 0) {
        n.current = 0;
        return;
      }
      e.preventDefault();
      n.current += 1;
      last.current = Date.now();
      if (n.current >= NEED) setOpen(true);
    }
    function onTouch(e: TouchEvent) {
      if (open) return;
      const el = document.documentElement;
      const atBottom = el.scrollHeight - el.scrollTop - el.clientHeight < 16;
      if (!atBottom) {
        n.current = 0;
        return;
      }
      n.current += 1;
      if (n.current >= NEED) {
        e.preventDefault();
        setOpen(true);
      }
    }
    window.addEventListener("wheel", onWheel, { passive: false });
    window.addEventListener("touchmove", onTouch, { passive: false });
    return () => {
      window.removeEventListener("wheel", onWheel);
      window.removeEventListener("touchmove", onTouch);
    };
  }, [open]);

  if (!open) return null;

  return (
    <div className="well-shaft relative -mx-3 mt-6" style={{ height: "8000px" }} aria-hidden>
      <div
        className="pointer-events-none sticky top-24 text-center text-[11px] text-white/50"
        style={{ textShadow: "0 0 12px #7bffd4" }}
      >
        The well is empty architecture. Future lives down here.
      </div>
    </div>
  );
}
