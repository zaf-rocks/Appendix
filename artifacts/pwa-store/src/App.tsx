import { useEffect, useMemo, useState } from 'react'
import {
  AppEntry,
  GENRE_META,
  GENRES,
  Genre,
  SEED,
} from './data'
import './index.css'

type Tab = 'browse' | 'submit' | 'about'

const QUEUE_KEY = 'shelf-submit-queue'
const CUSTOM_KEY = 'shelf-custom-apps'

function loadJson<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key)
    if (!raw) return fallback
    return JSON.parse(raw) as T
  } catch {
    return fallback
  }
}

function saveJson(key: string, value: unknown) {
  localStorage.setItem(key, JSON.stringify(value))
}

export default function App() {
  const [tab, setTab] = useState<Tab>('browse')
  const [query, setQuery] = useState('')
  const [genre, setGenre] = useState<Genre | 'all'>('all')
  const [selected, setSelected] = useState<AppEntry | null>(null)
  const [toast, setToast] = useState<string | null>(null)
  const [custom, setCustom] = useState<AppEntry[]>(() => loadJson(CUSTOM_KEY, []))
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null)

  const [name, setName] = useState('')
  const [tagline, setTagline] = useState('')
  const [url, setUrl] = useState('')
  const [formGenres, setFormGenres] = useState<Genre[]>(['microtool'])

  useEffect(() => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js').catch(() => {})
    }
    const onBip = (e: Event) => {
      e.preventDefault()
      setDeferredPrompt(e)
    }
    window.addEventListener('beforeinstallprompt', onBip)
    return () => window.removeEventListener('beforeinstallprompt', onBip)
  }, [])

  useEffect(() => {
    if (!toast) return
    const t = setTimeout(() => setToast(null), 2200)
    return () => clearTimeout(t)
  }, [toast])

  const catalog = useMemo(() => {
    const map = new Map<string, AppEntry>()
    ;[...SEED, ...custom].forEach((a) => map.set(a.id, a))
    return Array.from(map.values())
  }, [custom])

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    return catalog
      .filter((a) => {
        if (genre !== 'all' && !a.genres.includes(genre)) return false
        if (!q) return true
        return (
          a.name.toLowerCase().includes(q) ||
          a.tagline.toLowerCase().includes(q) ||
          a.genres.some((g) => GENRE_META[g].label.toLowerCase().includes(q)) ||
          (a.source || '').toLowerCase().includes(q)
        )
      })
      .sort((a, b) => Number(!!b.featured) - Number(!!a.featured) || a.name.localeCompare(b.name))
  }, [catalog, genre, query])

  function showToast(msg: string) {
    setToast(msg)
  }

  function toggleFormGenre(g: Genre) {
    setFormGenres((prev) =>
      prev.includes(g) ? (prev.length === 1 ? prev : prev.filter((x) => x !== g)) : [...prev, g]
    )
  }

  function submitApp(e: React.FormEvent) {
    e.preventDefault()
    if (!name.trim() || !tagline.trim()) {
      showToast('Name and tagline required')
      return
    }
    const entry: AppEntry = {
      id: `local-${Date.now()}`,
      name: name.trim(),
      tagline: tagline.trim(),
      url: url.trim() || '#',
      genres: formGenres,
      aiBuilt: true,
      source: 'Community submit',
    }
    const next = [entry, ...custom]
    setCustom(next)
    saveJson(CUSTOM_KEY, next)
    const queue = loadJson<AppEntry[]>(QUEUE_KEY, [])
    saveJson(QUEUE_KEY, [entry, ...queue])
    setName('')
    setTagline('')
    setUrl('')
    setFormGenres(['microtool'])
    setTab('browse')
    showToast('Added to your Shelf + submit queue')
  }

  async function installSelf() {
    if (deferredPrompt) {
      deferredPrompt.prompt()
      await deferredPrompt.userChoice
      setDeferredPrompt(null)
      showToast('Install prompt sent')
      return
    }
    showToast('Use browser menu → Install / Add to Home Screen')
  }

  return (
    <div className="app-shell">
      {toast && <div className="toast">{toast}</div>}

      <header className="topbar">
        <div className="brand">
          <div className="brand-mark">
            <img src="/favicon.svg" alt="" />
          </div>
          <div>
            <h1>Shelf</h1>
            <p>Installable web</p>
          </div>
        </div>
        <div className="top-actions">
          <button className="btn btn-ghost" type="button" onClick={installSelf}>
            Install Shelf
          </button>
          <button className="btn btn-primary" type="button" onClick={() => setTab('submit')}>
            Submit
          </button>
        </div>
      </header>

      {tab === 'browse' && (
        <>
          <div className="hero-blurb">
            <h2>Not another generic app directory.</h2>
            <p>
              Taxonomy for the vibe-coding flood: microtools, local-first, spatial interfaces, creator
              gear, experiments. Browse, filter, submit. Install this catalog itself.
            </p>
          </div>

          <div className="search-row">
            <div className="search-box">
              <span aria-hidden>⌕</span>
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search name, genre, source…"
                aria-label="Search apps"
              />
            </div>
            <div className="stats">
              {filtered.length} of {catalog.length} apps
            </div>
          </div>

          <div className="genre-rail" role="listbox" aria-label="Genres">
            <button
              type="button"
              className={`chip ${genre === 'all' ? 'active' : ''}`}
              onClick={() => setGenre('all')}
            >
              All
            </button>
            {GENRES.map((g) => (
              <button
                key={g}
                type="button"
                className={`chip ${genre === g ? 'active' : ''}`}
                style={{ ['--chip' as string]: GENRE_META[g].color }}
                onClick={() => setGenre(g)}
                title={GENRE_META[g].hint}
              >
                {GENRE_META[g].label}
              </button>
            ))}
          </div>

          {genre !== 'all' && (
            <p className="section-label">
              {GENRE_META[genre].label} · {GENRE_META[genre].hint}
            </p>
          )}

          {filtered.length === 0 ? (
            <div className="empty">Nothing matches. Try another genre or clear search.</div>
          ) : (
            <div className="grid">
              {filtered.map((app) => (
                <button
                  key={app.id}
                  type="button"
                  className="card"
                  onClick={() => setSelected(app)}
                >
                  <div className="card-top">
                    <h3>{app.name}</h3>
                    <div className="badges">
                      {app.featured && <span className="badge hot">Featured</span>}
                      {app.aiBuilt && <span className="badge ai">AI-built</span>}
                      {app.offline && <span className="badge off">Offline</span>}
                    </div>
                  </div>
                  <p>{app.tagline}</p>
                  <div className="card-foot">
                    <span>{app.genres.map((g) => GENRE_META[g].label).join(' · ')}</span>
                    <span>{app.source || '—'}</span>
                  </div>
                </button>
              ))}
            </div>
          )}
        </>
      )}

      {tab === 'submit' && (
        <form className="sheet" style={{ width: '100%', maxWidth: 560, margin: '0 auto' }} onSubmit={submitApp}>
          <h2 style={{ marginTop: 0 }}>Submit a PWA</h2>
          <p style={{ color: 'var(--muted)', fontSize: '0.9rem', marginTop: 0 }}>
            Stored locally on this device and queued for a future public review pass. No account.
          </p>
          <div className="field">
            <label htmlFor="name">Name</label>
            <input id="name" value={name} onChange={(e) => setName(e.target.value)} placeholder="App name" required />
          </div>
          <div className="field">
            <label htmlFor="tagline">Tagline</label>
            <textarea
              id="tagline"
              value={tagline}
              onChange={(e) => setTagline(e.target.value)}
              placeholder="One line that explains why it exists"
              required
            />
          </div>
          <div className="field">
            <label htmlFor="url">URL (optional for concepts)</label>
            <input
              id="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://…"
              inputMode="url"
            />
          </div>
          <div className="field">
            <label>Genres</label>
            <div className="genre-pick">
              {GENRES.map((g) => (
                <button
                  key={g}
                  type="button"
                  className={`chip ${formGenres.includes(g) ? 'active' : ''}`}
                  style={{ ['--chip' as string]: GENRE_META[g].color }}
                  onClick={() => toggleFormGenre(g)}
                >
                  {GENRE_META[g].label}
                </button>
              ))}
            </div>
          </div>
          <button className="btn btn-primary" type="submit" style={{ width: '100%' }}>
            Add to Shelf
          </button>
        </form>
      )}

      {tab === 'about' && (
        <div className="hero-blurb">
          <h2>Why Shelf exists</h2>
          <p style={{ marginBottom: '0.75rem' }}>
            Generic PWA directories already exist. None of them is the Play Store of the web — and that is
            fine. Shelf is an opinionated lane for the wave of AI-built and solo-dev installable apps:
            classification first, volume second.
          </p>
          <p style={{ marginBottom: '0.75rem' }}>
            Genres are the product: microtool, vibe-coded, local-first, spatial, creator, experiment —
            not a recycled Business / Games dump.
          </p>
          <p>
            This build is the light wrap: browse, filter, local submit queue, installable. Next steps can
            add evidence checks, public moderation, and ZAF concept routing.
          </p>
          <p className="install-hint">
            Chrome/Edge: menu → Install app. iOS Safari: Share → Add to Home Screen.
          </p>
        </div>
      )}

      <nav className="dock" aria-label="Primary">
        <button type="button" className={tab === 'browse' ? 'active' : ''} onClick={() => setTab('browse')}>
          Browse
        </button>
        <button type="button" className={tab === 'submit' ? 'active' : ''} onClick={() => setTab('submit')}>
          Submit
        </button>
        <button type="button" className={tab === 'about' ? 'active' : ''} onClick={() => setTab('about')}>
          About
        </button>
      </nav>

      {selected && (
        <div className="overlay" onClick={() => setSelected(null)} role="presentation">
          <div
            className="sheet"
            role="dialog"
            aria-modal="true"
            aria-labelledby="app-title"
            onClick={(e) => e.stopPropagation()}
          >
            <header>
              <div>
                <h2 id="app-title">{selected.name}</h2>
                <div className="badges" style={{ marginTop: '0.45rem' }}>
                  {selected.featured && <span className="badge hot">Featured</span>}
                  {selected.aiBuilt && <span className="badge ai">AI-built</span>}
                  {selected.offline && <span className="badge off">Offline</span>}
                  {selected.installable && <span className="badge">Installable</span>}
                </div>
              </div>
              <button type="button" className="close" onClick={() => setSelected(null)} aria-label="Close">
                ×
              </button>
            </header>
            <p style={{ color: 'var(--muted)', lineHeight: 1.45 }}>{selected.tagline}</p>
            <p style={{ fontSize: '0.8rem', color: 'var(--muted)' }}>
              {selected.genres.map((g) => GENRE_META[g].label).join(' · ')}
              {selected.source ? ` · ${selected.source}` : ''}
            </p>
            <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1rem', flexWrap: 'wrap' }}>
              {selected.url && selected.url !== '#' ? (
                <a className="btn btn-primary" href={selected.url} target="_blank" rel="noreferrer">
                  Open app
                </a>
              ) : (
                <button className="btn" type="button" disabled>
                  Concept — no live URL yet
                </button>
              )}
              <button className="btn" type="button" onClick={() => setSelected(null)}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
