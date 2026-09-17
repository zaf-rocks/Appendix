# Appendix — iteration ledger

Living log so Derek can say “go back to pass N” without reconstructing from memory.

**How to go back:** say the pass number (or a named beat: “single rows,” “monument hero,” “pre-well”). This file is the map. Snapshots live in git tags `pass-NN` when a pass is closed.

**Current live pass:** **15 — threshold match to screenshot** (2026-09-17)

---

## Locked product truths (do not silently undo)

- Name: **Appendix**. Mark is the stylized cracked **A**.
- Tagline (hero, one italic line, bottom-right): *Putting the Progressive in Progressive Web App.*
- Bottom nav stays five: Home / Crowds / Find / Games / Forge. Identity is top-right. Flints are the coin icon, not a sixth tab.
- Catalog is real listings. No fake ratings, no invented opens.
- Flints buy **eyes** (one-week sponsored) not stars.
- Legal string, exact: `Copyright 2026 ZAF Virtual Production Studios, LLC.`

---

## Pass 01 — Name + premise
**When:** early session, after dossiers / Noteworthy kill  
**What:** PWA yard, not a native store. Name brainstorm (Appository, Appocalypse, Post Wicked Apps, Appsolute…). **Appendix** wins: supplement, not organ.  
**Kept:** the premise.  
**Go back for:** naming only. Product already moved.

## Pass 02 — First shelf
**When:** first build  
**What:** static HTML/CSS/JS grid, search, taxonomy chips, install prompt. Zip workaround when preview 502’d.  
**Artifacts:** `artifacts/shelf/`, `artifacts/shelf-pwa.zip`  
**Status:** superseded. Do not restore unless Derek asks for the dead-simple wiki.

## Pass 03 — Play-store shell
**When:** “clone Google Play” packets  
**What:** Vite/React yard. Suggested / Top charts / Unconventional / For crowds / Categories / Editors. Detail, Find, Games, Forge, Census. Seed + expanded catalog.  
**Kept:** this is still the skeleton.

## Pass 04 — Identity + lens
**What:** VIBE vs ALL toggle. VIBE = spectrum / vibe-coded only. ALL = gold-rose luxury, entire index. Mark A, identity ring, Audiowide then later Orbitron.  
**Kept:** the toggle. Skins have since been restyled (see 12).

## Pass 05 — Monument hero (first cinematic)
**What:** long-shot scrapyard, phones, stylized A. Several grimy/slimy cuts.  
**Problem:** too muddy, too slime, phones floating.

## Pass 06 — Rails as Play
**What:** small icons, single-row carousels, hairline 4-color thresholds between aisles, sponsored / editors slightly larger. Letter tabs.  
**Kept:** this density is still the target.

## Pass 07 — Double-row experiment
**What:** two-row rails on several Home/Games aisles. Spectral outlines on letter tabs. Bigger feature tiles.  
**Verdict:** Derek killed it. Double is not working. Spectral tab outlines not working.

## Pass 08 — Roll back density
**What:** single rows again. 4-color thresholds restored. Captions even smaller. Feature rows only a few pixels larger. Letter tabs plain (later re-chipped in 12). Toggle under the word Appendix, full width of the word, thinner, colored on-side. “Amateur” stripped from copy → **Vibe-coded PWAs**. Orbitron on APPENDIX. 3D lettering.

## Pass 09 — Cleaner monument
**What:** new long-shot hero + OG still. Dry dirt/gravel scrapyard of broken phones (boxes, stacks, buried, random facing). Ultra-slow zoom. Screens blink on to the A, one after another. Same clip for Home + preview.  
**Assets:** `public/heroes/home-monument.mp4`, `home-monument.jpg`, `og.jpg`

## Pass 10 — Crowds two-carousel
**What:** Crowds tab = two chip rows. Top: crowds with no subtype. Second: crowds that have subtypes, subtype chips under that. Small icons.

## Pass 11 — Forge / vibe packet (prior alteration packet)
**What:** Desk → cubicle language, critic pool, claims, studio, census. Catalog expansion. Provenance lens.  
**Kept:** the rooms. Visuals restyled in 12.

## Pass 12 — Spec V.1.0 (LIVE)
**Source:** APPendix Master Architectural & UI/UX Specification V.1.0  
**Shipped:**

| Area | What landed |
|---|---|
| Lens | VIBE = jet-black nebula, gold + galactic violet. ALL = duller category tints (pink→red Suggested, blue→indigo Editors). Bookmarks stay loud. |
| Nav | Letter tabs match Find chips. Swipe feed to cycle A–F. Hero swaps with letter tab. Top Charts dividers crawl opposite directions. |
| Categories | A–Z from Business. Each genre is its own page with subcats. `/category/$genre` |
| YOU | Giant YOU, crowd cover, metadata, 3-color Sign out. `/me` |
| Peek | Long-press → peek/save modal (bookmark / favorites / stack) |
| Flints | 5 questions, “n of 5”, sentence snark, Learn more. Flashy Open the cubicle → beige cubicle, 3 paperclipped folders (2 sponsored + 1 random), 3 skips/day, Appendix Windows on the monitor |
| Games | 16-bit toy prompt stub (open-source remix later). Not a runtime. |
| Alerts | Welcome / reviews / Flint verification + newsletter opt-in |
| Footer | Contact us + exact copyright. Animated line above the tab bar |
| Well | Zero UI. ~16 extra swipes/wheels into the floor unlocks a deep cobble shaft. Empty architecture. |

**Deliberately not shipped in 12:** real 16-bit game runtime, real OS, 100-page DOM well (used a tall repeating parallax shaft instead).

**Key files this pass:**  
`src/styles.css`, `src/components/play-shell.tsx`, `src/components/rails.tsx`, `src/components/rail-rule.tsx`, `src/components/peek-save.tsx`, `src/components/cobble-well.tsx`, `src/components/yard-footer.tsx`, `src/routes/me.tsx`, `src/routes/flints.tsx`, `src/routes/games.tsx`, `src/routes/alerts.tsx`, `src/routes/index.tsx`, `src/routes/category.$genre.tsx`, `src/routes/contact.tsx`, `src/lib/letters.ts`

---

## Pass 13 — revert Spec V.1.0 (LIVE)
**Asked:** The spec dump wrecked the yard. Go back one iteration. Small packets from here.  
**Shipped:** Restored the pre-spec yard (passes 08–11): monument hero, single rows, 4-color thresholds, Orbitron + toggle under Appendix, Crowds two-carousels, simple You / Alerts / Flints cubicle. Removed nebula overlay, well, Appendix Windows, 16-bit toy, category pages, swipe-to-cycle letter tabs, peek/save modal, footer legal bar, cycling Top Charts lines.  
**Honest:** Pass 12 remains tagged if we ever want pieces of it. We will not dump a whole architecture packet on the next turn.  
**Snapshot:** pass-13

---

## Pass 14 — aisle type + original thresholds (LIVE)
**Asked:** Category titles (Games, Productivity, …) should match Editors’ Choice / Sponsored type. Restore original threshold: super-thin hairline, 4-color bar, super-thin hairline. One between each aisle, bands alternating down the page.  
**Shipped:** Every rail title uses `special-bar` (Orbitron, same size as Sponsored/Editors). `RailRule` is hairline / 2px four-color / hairline. Four bands cycle.  
**Snapshot:** pass-14

---

## Pass 15 — threshold match to screenshot (LIVE)
**Asked:** Match the attached shot: sandwich threshold between every aisle. Super-thin hairline, 4-color bar, super-thin hairline. Visible, full width.  
**Shipped:** Hairlines brighter (not half-pixel ghosts). Color bar 3px, full-bleed. Still one sandwich per aisle, four bands cycling.  
**Snapshot:** pass-15

---

## How the next pass gets logged

After each build, append:

```
## Pass NN — short name (DATE)
**Asked:** …
**Shipped:** …
**Not shipped / honest limits:** …
**Rolled back from:** …
**Snapshot:** pass-NN
```

If Derek says go back, restore the tagged snapshot and note it here as a new pass (“Pass NN — revert to MM”).
