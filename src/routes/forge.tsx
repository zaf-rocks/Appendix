import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { PlayShell } from "@/components/play-shell";
import { SuggestionSlip } from "@/components/suggestion-slip";
import { matchFactories, type Factory } from "@/lib/factories";
import { useLens } from "@/lib/lens";
import { specVars } from "@/lib/spectrum";

export const Route = createFileRoute("/forge")({ component: Forge });

const STEPS: { id: string; q: string; opts: { id: string; label: string; add: string }[] }[] = [
  {
    id: "kind",
    q: "Website, app, or both?",
    opts: [
      { id: "site", label: "Website", add: "website" },
      { id: "app", label: "App", add: "customer app employee app" },
      { id: "both", label: "Both", add: "website customer app" },
    ],
  },
  {
    id: "login",
    q: "Do people need an account?",
    opts: [
      { id: "no", label: "No login", add: "no identity login required no-login public pages" },
      { id: "yes", label: "Yes, accounts", add: "auth" },
      { id: "maybe", label: "Not sure", add: "" },
    ],
  },
  {
    id: "sched",
    q: "Scheduling or appointments?",
    opts: [
      { id: "yes", label: "Yes", add: "scheduling" },
      { id: "no", label: "No", add: "" },
    ],
  },
  {
    id: "pay",
    q: "Take payments or coupons?",
    opts: [
      { id: "pay", label: "Payments", add: "payments" },
      { id: "coup", label: "Coupons", add: "coupons" },
      { id: "both", label: "Both", add: "payments coupons" },
      { id: "no", label: "Neither", add: "" },
    ],
  },
  {
    id: "skill",
    q: "How do you want to build?",
    opts: [
      { id: "am", label: "I'm an amateur / vibe coding", add: "amateur no-code" },
      { id: "ok", label: "I can stitch a little", add: "api stitch" },
      { id: "dev", label: "I already write code", add: "code repo" },
    ],
  },
];

function Card({ f, tag, reasons }: { f: Factory; tag?: string; reasons?: string[] }) {
  return (
    <li className="rounded-xl bg-surface p-3 ring-1 ring-border">
      <div className="flex items-center justify-between gap-2">
        <p className="font-medium">{f.name}</p>
        {tag ? <span className="text-[10px] tracking-wide text-muted uppercase">{tag}</span> : null}
      </div>
      <p className="mt-1 text-[12px] text-muted">{f.line}</p>
      <p className="mt-2 text-[11px] text-muted">Can: {f.can.slice(0, 5).join(" · ")}</p>
      <p className="text-[11px] text-subtle">Cannot: {f.cannot.slice(0, 3).join(" · ")}</p>
      {reasons?.length ? <p className="mt-2 text-[12px] text-fg">Cut because: {reasons.join("; ")}</p> : null}
    </li>
  );
}

function Forge() {
  const { lens } = useLens();
  const [idea, setIdea] = useState("");
  const [step, setStep] = useState(0);
  const [picked, setPicked] = useState<string[]>([]);
  const [go, setGo] = useState(false);

  const prompt = useMemo(() => {
    const extra = picked.join(" ");
    return `${idea.trim()} ${extra}`.trim();
  }, [idea, picked]);

  const result = useMemo(
    () => (go && prompt.length >= 8 ? matchFactories(prompt, lens) : null),
    [go, prompt, lens],
  );

  function startOver() {
    setIdea("");
    setStep(0);
    setPicked([]);
    setGo(false);
  }

  function choose(add: string) {
    setPicked((p) => [...p, add]);
    if (step + 1 >= STEPS.length) setGo(true);
    else setStep((s) => s + 1);
  }

  return (
    <PlayShell
      heroTitle="Forge"
      heroLine="I have an idea. What should I build it with? Find stays for browsing what a builder already shipped."
    >
      <SuggestionSlip
        title="This page is the weird one."
        line="Forge is not a builder. It knocks tools out until a few are left. If that is not what you thought you opened, say so. The confusion helps. A real note is a Flint."
      />
      <div className="flex items-center justify-between">
        <p className="text-[11px] text-muted">Guided elimination. Not a factory catalog.</p>
        <button type="button" onClick={startOver} className="spec-pick" style={specVars(2)}>
          <span className="spec-pick-face">Start over</span>
        </button>
      </div>

      <textarea
        value={idea}
        onChange={(e) => {
          setIdea(e.target.value);
          setGo(false);
        }}
        placeholder="What do you want to build?"
        className="mt-3 h-24 w-full rounded-md border border-border bg-surface p-2 text-[13px]"
      />

      {!go && idea.trim().length >= 3 ? (
        <div className="mt-4">
          <p className="text-[13px] font-medium">{STEPS[step].q}</p>
          <div className="mt-2 flex flex-wrap gap-1.5">
            {STEPS[step].opts.map((o, i) => (
              <button
                key={o.id}
                type="button"
                onClick={() => choose(o.add)}
                className="spec-pick"
                style={specVars(step * 5 + i + 8)}
              >
                <span className="spec-pick-face">{o.label}</span>
              </button>
            ))}
          </div>
        </div>
      ) : null}

      {idea.trim().length >= 8 && !go ? (
        <button
          type="button"
          onClick={() => setGo(true)}
          className="mt-4 h-9 rounded-full bg-get px-4 text-[12px] font-semibold text-get-fg"
        >
          Skip questions — match now
        </button>
      ) : null}

      {result ? (
        <div className="mt-5 space-y-3">
          <h2 className="special-bar">Three fits</h2>
          <ol className="space-y-2">
            {result.top.map((f, i) => (
              <Card key={f.id} f={f} tag={`#${i + 1}`} />
            ))}
          </ol>
          {result.sponsored ? (
            <>
              <h2 className="special-bar">Sponsored builder</h2>
              <ul>
                <Card f={result.sponsored} tag="visibility, not a badge" />
              </ul>
            </>
          ) : null}
          {result.stitch ? (
            <p className="text-[12px] text-muted">
              Honest stitch: {result.stitch.id} — {result.stitch.line}
            </p>
          ) : null}
          {result.cut.length ? (
            <div>
              <h2 className="pt-2 text-[10px] font-medium tracking-wide text-muted uppercase">Cut</h2>
              <ul className="mt-2 space-y-2">
                {result.cut.slice(0, 5).map((c) => (
                  <Card key={c.factory.id} f={c.factory} tag="cut" reasons={c.reasons} />
                ))}
              </ul>
            </div>
          ) : null}
        </div>
      ) : (
        <p className="mt-3 text-[11px] text-muted">
          Describe the thing. We cut platforms whose cannot/weaknesses block the job. Browse every
          builder under Find → Built on.
        </p>
      )}
    </PlayShell>
  );
}
