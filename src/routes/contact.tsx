import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { PlayShell } from "@/components/play-shell";
import { specVars } from "@/lib/spectrum";
import { submitSuggestion } from "@/lib/well-api";

export const Route = createFileRoute("/contact")({ component: Contact });

const KINDS = [
  { id: "comment", label: "Press" },
  { id: "question", label: "Legal" },
  { id: "idea", label: "Partnership" },
  { id: "concern", label: "Something else" },
] as const;

function Contact() {
  const [kind, setKind] = useState<(typeof KINDS)[number]["id"]>("comment");
  const [body, setBody] = useState("");
  const [email, setEmail] = useState("");
  const [msg, setMsg] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setMsg(null);
    try {
      const r = await submitSuggestion({ data: { kind, body: body.trim(), email: email.trim() } });
      setBody("");
      setMsg(r.ok ? "Sent. We’ll read it." : "Sent.");
    } catch {
      setMsg("Needed a real note — at least a sentence.");
    }
    setBusy(false);
  }

  return (
    <PlayShell heroTitle="Contact" heroLine="Press, legal, a human reply. Not the comment box.">
      <p className="text-[13px] text-muted">
        This form is for reaching the company. A missing app, a wrong shelf, or an idea about Appendix
        belongs in the note between the Home aisles, or on Forge. Those pay a Flint. This one is just mail.
      </p>
      <form onSubmit={onSubmit} className="mt-4 space-y-3 rounded-xl bg-surface p-4 ring-1 ring-border">
        <div className="flex flex-wrap gap-1.5">
          {KINDS.map((k, i) => (
            <button
              key={k.id}
              type="button"
              onClick={() => setKind(k.id)}
              className={kind === k.id ? "spec-pick spec-pick-on" : "spec-pick"}
              style={specVars(i + 30)}
            >
              <span className="spec-pick-face">{k.label}</span>
            </button>
          ))}
        </div>
        <textarea
          value={body}
          onChange={(e) => setBody(e.target.value)}
          placeholder="What do you need from us?"
          className="h-28 w-full rounded-lg border border-border bg-bg p-3 text-[13px] outline-none"
        />
        <input
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email so we can reply"
          className="h-11 w-full rounded-lg border border-border bg-bg px-3 text-[13px] outline-none"
        />
        <button
          type="submit"
          disabled={busy}
          className="h-11 w-full rounded-full bg-primary text-[13px] font-semibold text-primary-fg"
        >
          {busy ? "Sending…" : "Send"}
        </button>
        {msg ? <p className="text-[12px] text-muted">{msg}</p> : null}
      </form>
      <p className="mt-6 text-[12px] text-muted">
        Press, claims, legal:{" "}
        <a href="mailto:hello@zaf.rocks" className="text-primary">
          hello@zaf.rocks
        </a>
      </p>
      <p className="mt-4 text-[10px] text-muted">Copyright 2026 ZAF Virtual Production Studios, LLC.</p>
    </PlayShell>
  );
}
