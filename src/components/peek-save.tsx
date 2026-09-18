import { Bookmark, Star } from "lucide-react";
import { useState } from "react";
import { AppIcon } from "@/components/app-icon";
import type { AppEntry } from "@/lib/catalog";
import { favIds, isSaved, listStacks, toggleFav, toggleInStack, toggleSave } from "@/lib/yard";
import { cn } from "@/lib/cn";

export function PeekSave({ app, onClose }: { app: AppEntry; onClose: () => void }) {
  const [, bump] = useState(0);
  const saved = isSaved(app.id);
  const fav = favIds().includes(app.id);
  const stacks = listStacks();

  return (
    <div className="fixed inset-0 z-50 grid place-items-end bg-black/65 p-3 pb-24" onClick={onClose}>
      <div className="w-full max-w-3xl rounded-2xl bg-bg p-4 ring-1 ring-border" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center gap-3">
          <AppIcon name={app.name} iconUrl={app.iconUrl} className="size-12" />
          <div className="min-w-0">
            <p className="truncate text-[14px] font-semibold">{app.name}</p>
            <p className="truncate text-[11px] text-muted">{app.tagline}</p>
            <p className="text-[10px] text-muted">
              {app.platform ? `Built with ${app.platform}` : "Builder unknown"} · {app.genres[0]}
            </p>
          </div>
        </div>
        <div className="mt-3 grid grid-cols-2 gap-2 text-[11px] sm:grid-cols-3">
          <button
            type="button"
            onClick={() => {
              if (saved) toggleSave(app.id);
              bump((n) => n + 1);
              onClose();
            }}
            className={cn("rounded-xl p-3 ring-1 ring-border", saved && "bg-cat-amber text-black")}
          >
            <Bookmark className="mx-auto mb-1 size-4" />
            {saved ? "Remove bookmark" : "Bookmark"}
          </button>
          <button
            type="button"
            onClick={() => {
              if (!isSaved(app.id)) toggleSave(app.id);
              toggleFav(app.id);
              bump((n) => n + 1);
              onClose();
            }}
            className={cn("rounded-xl p-3 ring-1 ring-border", fav && "bg-cat-amber text-black")}
          >
            <Star className="mx-auto mb-1 size-4" />
            {fav ? "In Favorites" : "Favorite"}
          </button>
          {stacks.map((s) => {
            const on = s.ids.includes(app.id);
            return (
              <button
                key={s.id}
                type="button"
                onClick={() => {
                  if (!isSaved(app.id)) toggleSave(app.id);
                  toggleInStack(s.id, app.id);
                  bump((n) => n + 1);
                  onClose();
                }}
                className={cn("rounded-xl p-3 ring-1 ring-border", on && "bg-cat-amber text-black")}
              >
                {on ? `In ${s.name}` : `Add to ${s.name}`}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}