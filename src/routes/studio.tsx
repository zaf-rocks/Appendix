import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { StoreShell } from "@/components/store-shell";
import { GENRE_META, GENRES, PLATFORMS, type Genre } from "@/lib/catalog";
import { myListings, submitListing } from "@/lib/store-api";
import { RedirectToSignIn } from "@/lib/auth/gates";
import { useCurrentUserState } from "@/lib/auth/use-current-user";
import { cn } from "@/lib/cn";

export const Route = createFileRoute("/studio")({ component: Studio });

function Studio() {
  const { user, isPending } = useCurrentUserState();
  const [mine, setMine] = useState<Awaited<ReturnType<typeof myListings>>>([]);
  const [name, setName] = useState("");
  const [tagline, setTagline] = useState("");
  const [description, setDescription] = useState("");
  const [url, setUrl] = useState("");
  const [developerName, setDeveloperName] = useState("");
  const [genres, setGenres] = useState<Genre[]>(["tools"]);
  const [paid, setPaid] = useState(false);
  const [comingSoon, setComingSoon] = useState(true);
  const [platform, setPlatform] = useState("Unknown");
  const [iconUrl, setIconUrl] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [screenshots, setScreenshots] = useState("");
  const [installable, setInstallable] = useState(true);
  const [offline, setOffline] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);

  useEffect(() => {
    if (!user) return;
    void myListings()
      .then(setMine)
      .catch(() => setMine([]));
  }, [user]);

  if (isPending) {
    return (
      <StoreShell>
        <div className="h-40 animate-pulse rounded-xl bg-raised" />
      </StoreShell>
    );
  }
  if (!user) return <RedirectToSignIn />;

  const me = user;

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setMsg(null);
    try {
      await submitListing({
        data: {
          name,
          tagline,
          description,
          url: comingSoon ? "#" : url,
          developerName: developerName || me.displayName || "Independent",
          genres,
          paid,
          comingSoon,
          platform,
          iconUrl,
          contactEmail,
          screenshots,
          installable,
          offline,
        },
      });
      setName("");
      setTagline("");
      setDescription("");
      setUrl("");
      setMsg("Listed. No APK was harmed in this publishing.");
      setMine(await myListings());
    } catch (err) {
      setMsg(err instanceof Error ? err.message : "Could not publish");
    }
  }

  return (
    <StoreShell>
      <h1 className="text-2xl font-semibold">Developer studio</h1>
      <p className="mt-2 max-w-xl text-muted">
        File a PWA. We take a URL, a name, and a straight face. Screening is
        mostly the illusion of civilization — plus the fact that you had to sign
        in.
      </p>

      <form onSubmit={onSubmit} className="mt-6 space-y-3 rounded-xl bg-surface p-5 ring-1 ring-border">
        <Field label="App name" value={name} onChange={setName} />
        <Field label="Short tagline" value={tagline} onChange={setTagline} />
        <label className="block">
          <span className="mb-1 block text-sm text-muted">Description</span>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="h-24 w-full rounded-lg border border-border bg-bg p-3 outline-none"
          />
        </label>
        <Field
          label="Developer name"
          value={developerName}
          onChange={setDeveloperName}
          placeholder={user.displayName ?? "Studio name"}
        />
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" checked={comingSoon} onChange={(e) => setComingSoon(e.target.checked)} />
          Coming soon (advance notice, no live URL yet)
        </label>
        {!comingSoon ? (
          <Field label="Live URL" value={url} onChange={setUrl} placeholder="https://" />
        ) : null}
        <Field
          label="Icon URL. Blank = we pull the site’s own favicon. That’s real, not a guess."
          value={iconUrl}
          onChange={setIconUrl}
          placeholder="https://…/icon.png"
        />
        <label className="block text-sm">
          <span className="mb-1 block text-muted">Or upload an icon (PNG/SVG, under 80KB)</span>
          <input
            type="file"
            accept="image/png,image/svg+xml,image/jpeg,image/webp"
            onChange={(e) => {
              const f = e.target.files?.[0];
              if (!f) return;
              if (f.size > 80_000) {
                setMsg("Icon must be under 80KB. Compress it or paste a URL.");
                return;
              }
              const reader = new FileReader();
              reader.onload = () => setIconUrl(String(reader.result || ""));
              reader.readAsDataURL(f);
            }}
          />
        </label>
        <Field
          label="Screenshot URLs (comma separated)"
          value={screenshots}
          onChange={setScreenshots}
        />
        <Field
          label="Contact email for claims / review"
          value={contactEmail}
          onChange={setContactEmail}
          placeholder="you@studio.dev"
        />
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" checked={installable} onChange={(e) => setInstallable(e.target.checked)} />
          Installable on the home screen
        </label>
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" checked={offline} onChange={(e) => setOffline(e.target.checked)} />
          Works offline — does not need the internet
        </label>
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" checked={paid} onChange={(e) => setPaid(e.target.checked)} />
          People pay to use this app
        </label>
        <label className="block">
          <span className="mb-1 block text-sm text-muted">Built on (required — browsers shop by factory)</span>
          <select
            value={platform}
            onChange={(e) => setPlatform(e.target.value)}
            className="h-11 w-full rounded-lg border border-border bg-bg px-3"
          >
            {PLATFORMS.map((p) => (
              <option key={p} value={p}>
                {p}
              </option>
            ))}
          </select>
        </label>
        <div>
          <p className="mb-2 text-sm text-muted">Categories</p>
          <div className="flex flex-wrap gap-2">
            {GENRES.map((g) => (
              <button
                key={g}
                type="button"
                onClick={() =>
                  setGenres((prev) =>
                    prev.includes(g)
                      ? prev.length === 1
                        ? prev
                        : prev.filter((x) => x !== g)
                      : [...prev, g],
                  )
                }
                className={cn(
                  "h-9 rounded-full px-3 text-sm",
                  genres.includes(g) ? "bg-fg text-bg" : "bg-raised text-muted",
                )}
              >
                {GENRE_META[g].label}
              </button>
            ))}
          </div>
        </div>
        <button type="submit" className="h-12 w-full rounded-full bg-primary font-semibold text-primary-fg">
          Publish listing
        </button>
        {msg ? <p className="text-sm text-muted">{msg}</p> : null}
      </form>

      <h2 className="mt-8 text-sm font-semibold text-muted">Your listings</h2>
        <Link to="/advertise" className="mt-4 inline-block text-sm text-primary">
          Want the Desk? Sponsor plans
        </Link>
      <ul className="mt-3 space-y-2">
        {mine.map((a) => (
          <li key={a.id}>
            <Link to="/app/$id" params={{ id: a.id }} search={{ desk: undefined }} className="block rounded-xl bg-surface p-3 ring-1 ring-border">
              <p className="font-medium">{a.name}</p>
              <p className="text-sm text-muted">{a.tagline}</p>
            </Link>
          </li>
        ))}
      </ul>
    </StoreShell>
  );
}

function Field({
  label,
  value,
  onChange,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
}) {
  return (
    <label className="block">
      <span className="mb-1 block text-sm text-muted">{label}</span>
      <input
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        className="h-11 w-full rounded-lg border border-border bg-bg px-3 outline-none"
      />
    </label>
  );
}
