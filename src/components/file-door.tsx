import { Link } from "@tanstack/react-router";
import { useState } from "react";
import { saveFileDraft } from "@/lib/file-draft";
import { cn } from "@/lib/cn";

export function FileChip({
  signedIn,
  open,
  onOpen,
}: {
  signedIn: boolean;
  open: boolean;
  onOpen: () => void;
}) {
  const face = <span className="letter-tab-face">File an app</span>;
  if (signedIn) {
    return (
      <Link to="/studio" data-tone="2" className="letter-tab">
        {face}
      </Link>
    );
  }
  return (
    <button
      type="button"
      data-tone="2"
      aria-expanded={open}
      onClick={onOpen}
      className={cn("letter-tab", open && "letter-tab-on")}
    >
      {face}
    </button>
  );
}

export function FileSlip() {
  const [name, setName] = useState("");
  const [url, setUrl] = useState("");
  const [line, setLine] = useState("");

  function keep() {
    const draft = { name: name.trim(), url: url.trim(), line: line.trim() };
    if (draft.name || draft.url || draft.line) saveFileDraft(draft);
  }

  return (
    <form id="file-slip" className="mx-3 mt-2 rounded-xl bg-surface p-3 ring-1 ring-border">
      <p className="text-[12px] text-muted">Name, a link, one sentence. Sign in, and Studio keeps them.</p>
      <input
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="App name"
        className="mt-2 h-9 w-full rounded-lg border border-border bg-bg px-3 text-[13px]"
      />
      <input
        value={url}
        onChange={(e) => setUrl(e.target.value)}
        placeholder="https://"
        inputMode="url"
        className="mt-2 h-9 w-full rounded-lg border border-border bg-bg px-3 text-[13px]"
      />
      <input
        value={line}
        onChange={(e) => setLine(e.target.value)}
        placeholder="One sentence"
        className="mt-2 h-9 w-full rounded-lg border border-border bg-bg px-3 text-[13px]"
      />
      <Link
        to="/login"
        search={{ next: "studio" }}
        onClick={keep}
        className="mt-2 flex h-9 items-center justify-center rounded-full bg-primary text-[12px] font-semibold text-primary-fg"
      >
        Sign in to file
      </Link>
    </form>
  );
}
