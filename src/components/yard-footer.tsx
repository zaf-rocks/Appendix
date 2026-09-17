import { Link } from "@tanstack/react-router";

export function YardFooter() {
  return (
    <footer className="mt-8 pb-2">
      <div className="cycle-ccw mb-3" />
      <div className="flex items-center justify-between gap-3">
        <Link to="/contact" className="h-8 rounded-full bg-raised px-3 text-[11px] leading-8 ring-1 ring-border">
          Contact us
        </Link>
        <p className="text-right text-[10px] text-muted">Copyright 2026 ZAF Virtual Production Studios, LLC.</p>
      </div>
    </footer>
  );
}
