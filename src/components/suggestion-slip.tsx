import { useState } from "react";
import { submitSuggestion } from "@/lib/well-api";
import { addFlints } from "@/lib/yard";

export function SuggestionSlip({ title, line }: { title: string; line: string }) {
  const [body, setBody] = useState("");
  const [open, setOpen] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    try {
      const r = await submitSuggestion({ data: { kind: "comment", body: body.trim(), email: "" } });
      addFlints(r.shards);
      setBody("");
      setMsg("Got it. +1 Flint.");
    } catch {
      setMsg("A little more detail.");
    }
  }

  return (
    <section className="my-3 rounded-xl bg-surface px-3 py-2 ring-1 ring-border">
      <button type="button" onClick={() => setOpen((v) => !v)} className="w-full text-left">
        <p className="text-[12px] font-medium">{title}</p>
        <p className="mt-0.5 text-[11px] text-muted">{line}</p>
      </button>
      {open ? (
        <form onSubmit={onSubmit} className="mt-2 space-y-2">
          <textarea
            value={body}
            onChange={(e) => setBody(e.target.value)}
            placeholder="Say the thing."
            className="h-16 w-full rounded-md border border-border bg-bg p-2 text-[12px]"
          />
          <button type="submit" className="h-7 rounded-full bg-primary px-3 text-[11px] text-primary-fg">
            Leave it
          </button>
          {msg ? <p className="text-[11px] text-muted">{msg}</p> : null}
        </form>
      ) : null}
    </section>
  );
}
