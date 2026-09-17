import { createFileRoute } from "@tanstack/react-router";
import { PlayShell } from "@/components/play-shell";

export const Route = createFileRoute("/contact")({ component: Contact });

function Contact() {
  return (
    <PlayShell heroTitle="Contact us" heroLine="The yard reads mail. Slowly, but it reads it.">
      <p className="text-[13px] text-muted">
        Appendix is a ZAF Virtual Production Studios, LLC project. For claims, press, or “your listing
        is wrong,” write:
      </p>
      <a href="mailto:hello@zaf.rocks" className="mt-3 inline-block text-[14px] text-primary">
        hello@zaf.rocks
      </a>
      <p className="mt-6 text-[10px] text-muted">Copyright 2026 ZAF Virtual Production Studios, LLC.</p>
    </PlayShell>
  );
}
