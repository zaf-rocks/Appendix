import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

export type Lens = "vibe" | "all";
const KEY = "appendix-lens";

const Ctx = createContext<{ lens: Lens; setLens: (l: Lens) => void }>({
  lens: "all",
  setLens: () => {},
});

function apply(l: Lens) {
  if (typeof document === "undefined") return;
  document.documentElement.setAttribute("data-lens", l);
}

export function LensProvider({ children }: { children: ReactNode }) {
  const [lens, setLensState] = useState<Lens>("all");
  useEffect(() => {
    let start: Lens = "all";
    try {
      const saved = localStorage.getItem(KEY);
      if (saved === "vibe" || saved === "all") start = saved;
    } catch {
      /* ignore */
    }
    setLensState(start);
    apply(start);
  }, []);
  function setLens(l: Lens) {
    setLensState(l);
    apply(l);
    try {
      localStorage.setItem(KEY, l);
    } catch {
      /* ignore */
    }
  }
  return <Ctx.Provider value={{ lens, setLens }}>{children}</Ctx.Provider>;
}

export function useLens() {
  return useContext(Ctx);
}