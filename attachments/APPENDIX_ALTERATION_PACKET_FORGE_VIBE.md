# APPENDIX — ALTERATION PACKET
## Forge · Vibe lens · Home hero · Crowds taxonomy · Bookmark triggers
Keep the yard that exists. Do not redesign. Do not restart. Do not invent a new visual system.

Derek authorized this as a **multi-job packet**. Execute in the order written. If a change would restyle a hero, rewrite a Crowds kicker, shrink chrome, or merge Find into Forge, skip that change and leave a note.

Language in this product: it is a **yard**, not a store. Opens, not downloads. Paying buys eyes, not stars.

---

## 0. What this pass is (and is not)

This pass is identity + navigation + one data lens.

It is **not** Stripe. It is **not** a new profile. It is **not** another chrome restyle. It is **not** flattening Crowds into Categories. It is **not** replacing Find with Forge.

Test when done:
1. Home hero is a monument, not floating wallpaper. Tagline is readable.
2. Bottom tabs read: Home · Crowds · Find · Games · Forge
3. A vibe/all control lives in top chrome on every screen, defaults to vibe-coded only, persists across tabs, and does **not** restyle the UI.
4. Crowds still uses the same names and kickers. Selecting a crowd reveals a subtype row.
5. Bookmark saves from tap, swipe, and long-press.
6. Forge still cuts unfit factories and returns 3 + 1 sponsored. Matching uses cannot/weakness fields, not keyword luck.

---

## 1. KEEP (do not restyle, do not relocate)

### Chrome
- Top right, left → right: Bookmarks · Flints · Alerts · Identity
- Identity stays visibly larger than the other three
- Identity still opens `/me` + sign-in. Do not invent a new profile.
- Flints still owns The Desk. `/desk` still redirects into Flints.
- Desk rules stay: always exactly 3 tickets, 2 from paid/sponsored pool + 1 random from the catalog, unlabeled, skip or finish refills that chair only, grind all day.
- Open PWA → sit ~45s → real sentence → Flints. Open alone = 0. Stars with no note = 0. Scout +2 / Bench +3 copy stays.
- Redeem copy stays: 24 Flints = one Home billboard this period. If they already pay $4.99, redeem can stack a second slot. “I already pay” may remain a stand-in checkbox. Do not wire Stripe this pass.

### Rooms that stay rooms
- Find stays “what should this app do for me.” Search + chips stay. Do not replace Find with Forge.
- Games stays Games. Leave its hero, HUD, and copy alone except where this packet names a data/filter change.
- Crowds names and kickers stay verbatim. Do not flatten into Categories. Do not rewrite kickers “to sound clearer.”
- Listing header + Open PWA stay. Listing extras already under Open PWA stay (screenshots, longer About, chips, report broken link, More by maker, fourth-review flag ritual).
- Green / red status mark before a title stays: green = live/openable, red = dead / broken / coming soon. If a red listing still offers Open PWA as if it were live, that is a liar — disable or relabel Open PWA on red listings. Do not invent a new status system.

### Heroes that stay
- Games, Find, Crowds, Desk/Flints, listing, bookmarks, alerts heroes and looping videos stay.
- Witty strings stay.
- Fake 4.7 / 250k wallpaper stays gone.
- Opens, not downloads.

### Money copy (unchanged this pass)
- $4.99/mo — Billboard on Home
- $19.99/mo — into the sponsored desk pool
- Paying = visibility. Not stars. Not a quality badge.
- Badge only from yard rating ~4.5+

---

## 2. MOVE

### Bottom tabs — new order
Old: Home · Games · Find · Crowds · Census  
New: **Home · Crowds · Find · Games · Forge**

Reasons already decided:
- Zero public users, so muscle memory is not a cost.
- Crowds is the personality of the yard (people-aisles). It sits second.
- Games is not killed. It moves to four because it is empty from thin seed, not because the room is wrong.
- Census is renamed Forge (see §4). Same room, new name.

`/census` and any old Census nav labels redirect to Forge. Do not leave a sixth tab. Do not put Desk back on the tab bar.

---

## 3. ADD — Vibe lens (chrome control, not a sixth tab)

### Decision (locked)
Provenance is a **lens**, not a destination.

Do **not** add a Vibe tab. Derek explicitly rejected a sixth bottom tab. The entire yard is dedicated to vibe-coded PWAs by default. The control includes professional / team-built PWAs when the user asks for them.

### Placement
Put a compact binary control in the **top chrome**, between the Appendix wordmark on the left and the four circular buttons on the right.

It must be visible on every screen that uses that chrome (Home, Crowds, Find, Games, Forge, listings, Bookmarks, Alerts, Identity, Flints/Desk). It persists across navigation. Flipping it on Home and then opening Find must still be flipped.

### Binary states
- **VIBE** (default): only listings tagged vibe-coded / amateur / single-maker / vibe-platform builds.
- **ALL**: vibe-coded + professionally developed PWAs (Spotify-class, Linear-class, team-built).

Do not add a third position. “All web apps / all PWAs / vibe” was naming the two ends plus the default, not three modes.

### Labels
Use dry labels on the control itself: **VIBE** and **ALL**.
Do not put jokes on the control (“masterpiece / disaster pieces”). Wit stays in room copy and kickers, not on the chrome control.

### What the lens does
Same skin. Different guts.

When the user flips VIBE → ALL:
- Do **not** change heroes, gradients, type, colors, layout, tab bar, or chrome besides the control’s own selected state.
- Re-query every rail, result list, crowd aisle, game aisle, similar-apps rail, and Desk random-from-catalog chair against the provenance field.
- Empty rails stay empty rather than being restyled. Prefer a one-line empty state in existing type: “Nothing vibe-coded in this aisle yet.” Do not invent a new empty-state illustration system.

### Provenance field (required on every listing)
Add a listing field:

`provenance: "vibe" | "pro"`

Rules:
- ZAF titles (KaraokeDokie, PRESET // IRL, Noteworthy, and any other ZAF coming-soon cards) default to `vibe`.
- Listings whose factory is an AI / vibe builder (Grok, Lovable, Bolt, v0, Emergent, Floot, Replit Agent, Base44, Rork, CatDoes, Softgen, Anything, etc.) default to `vibe` unless Derek later marks them pro.
- Known team-built / product-company PWAs (Spotify, Linear, Canva, Photopea if treated as a product, etc.) default to `pro`.
- If unknown, default `vibe`. Unknown does **not** get invented into “pro” to look complete.
- Show a small provenance chip on the listing page and on cards if a chip slot already exists. Do not invent a new badge language. If a chip row already has factory / free / paid, add `Vibe` or `Pro` there.

### How each room expresses the lens (native, not a duplicate UI)
- **Home** — existing top chips/rails keep their names. Under VIBE, Suggested / Top charts / Unconventional / Crowds / Categories / Editors’ Choice only include `vibe` listings. Under ALL, mix is allowed. Do not add a sixth “Vibe-coded” rail unless a chip slot already exists and can take the word without restyle. Prefer filtering the existing rails.
- **Crowds** — same crowd names. Under VIBE, aisles show amateur / vibe stacks. Under ALL, pro tools may appear in the same aisle (a professional singer’s DAW can sit next to an amateur karaoke PWA only when ALL is on).
- **Find** — query + chips still run. Provenance is an implicit first cut when VIBE is on. Do not add a loud extra filter row if the chrome control already states the mode.
- **Games** — same. VIBE = vibe-coded games. ALL = include polished / team-built web games.
- **Forge** — VIBE defaults the matchmaker toward amateur-friendly factories (Lovable, Bolt, Glide, Bubble, etc.). ALL may keep those plus pro / LCAP / stitch-API shops. The honest “stitch APIs if you can” line stays in both modes.
- **Desk** — do not label chairs as vibe vs pro. The lens still applies to which catalog items can land in the random chair. Paid/sponsored chairs stay paid/sponsored regardless of lens, unless a sponsored item is `pro` and VIBE is on — then that sponsored chair must refill from a vibe sponsored item if one exists, else refill from vibe catalog so the chair is never empty. Never leave a hole.

### Persistence
Remember the last chosen state on the device. Default for a first visit is **VIBE**.

---

## 4. RENAME — Census → Forge

Tab 5 label: **Forge**

Census sounded like a government form. Forge is the place you go to build.

Same job as Census:
- User describes the site/app they want to build.
- Unfit factories are cut.
- Return exactly **three** fits + **one sponsored** factory.
- Keep the honest line when a cut platform (Cursor / Claude / vanilla stitch) is still better if the user will learn APIs.

Do not merge Find and Forge. Find = use an app. Forge = build with a platform.

Old “Census” copy in the tab bar, headings, and routes becomes Forge. Hero for this tab stays; do not restyle it just because the name changed.

### Forge matching (upgrade from keyword scoring)
Replace keyword scoring with a factory dossier the matchmaker can read without a live network call.

Each factory record:

- name, url, category
- can
- cannot (load-bearing)
- strengths
- weaknesses (load-bearing)
- pricing model, auth, payments, scheduling, coupons, native apps, exports, hosting, skill level
- original one-line blurb (never homepage hero text)
- last_verified
- provenance hint for the factory itself: amateur-friendly vs pro/LCAP vs stitch

Matching rule:
1. Read the user’s build description.
2. Cut every factory whose **cannot / weaknesses** block a required capability.
3. Rank survivors by actual fit, not synonym count.
4. Return exactly three + one sponsored stall.
5. If a field is unknown, write `unknown`. Do not invent a capability.

Seed factories (do not wait for a perfect 207). Use this first cut; unknown fields stay unknown:

Classics: Bubble, FlutterFlow, Adalo, Glide, Softr, Draftbit, Thunkable, GoodBarber, WeWeb, AppSheet, Zoho Creator

Internal: Retool, Appsmith, Budibase, ToolJet, Superblocks, Noloco

Enterprise LCAP: Mendix, OutSystems, Power Apps, Salesforce Lightning, Appian, ServiceNow App Engine, Oracle APEX

AI / vibe builders: Lovable, Bolt.new, v0, Replit Agent, Base44 (note Wix acquisition ~Jun 2025, still its own product), Rork, CatDoes, Emergent, Softgen, Anything (ex-Create.xyz), a0.dev

Visual / hybrid: Plasmic, Builder.io, Toddle (watch — Nordcraft pivot)

Also add if missing: Bilt, Zite, Bravo Studio, BuildFire, Backendless, Xano, Directual, Wized, Betty Blocks, Kissflow

Keep off the core result list unless Derek overrides: Dora AI, Durable, 10Web, Framer-as-site-builder, paused Webflow App Gen, dead Bildr, Fillout-as-forms, Cursor-class IDEs as if they were one-click factories. Those may live in a watch note or in the honest stitch line, not as one of the three survivors for an amateur prompt.

Factory names in Forge must stay aligned with Find → Built-on. Do not invent a second factory universe.

Acceptance test prompt:
“Amateur exterminator. Website with coupons, scheduling, service info, no identity login required. Plus a customer scheduling app. Plus an employee app for scheduling and protocols.”
Forge must return three named factories with cannot/weakness reasons, not “these pages mentioned scheduling.”

---

## 5. HOME — cinematic hero + tagline + strips + Editors’ Choice

### Home hero only
Derek likes every other tab’s hero. Home is the exception.

Current Home hero reads as a floating wordmark / screensaver. Change **Home only**.

Target:
- Cinematic and more serious than a floating name.
- Appendix wordmark is a monument, not wallpaper.
- Text is three-dimensional (extruded / beveled / catching light), both the word **APPENDIX** and the tagline.
- Tagline is larger and more apparent than it is now.
- Tagline copy: **the post-apocalyptic scrapyard**
  - Keep the visual wordplay already in the product myth: APP inside apocalyptic, SCRAPP inside scrapyard, “post” because people post apps. Do not add a lecture about the pun. Just put the line on the hero where a stranger can read it after the name.

Motion direction (Home only):
- Slow push-in. Dust / particulate. Letters that feel carved or forged, not CSS-float.
- Tagline should feel branded underneath the wordmark — a line being struck or catching light — not a caption in body type.
- Loop must stay tasteful. No new color system. Stay inside the existing scrapyard palette already used by other heroes.

Do not shrink the hero. Do not restyle the rest of Home to “match” a new hero. Rails, chips, and tiles stay.

### ARTISTIC LIBERTY (flagged — reverse if Derek hates it)
After the wordmark settles, let a single hairline crack run through the last letters of APPENDIX and stop before the tagline, as if the monument is load-bearing scrap, not glass type. No extra particles beyond what the current motion language already allows. If this fights the existing Home loop, drop the crack and keep 3D + tagline only.

### Gradient strips on Home
Keep the existing gradient **strips** (the thin colored lines between rails). Derek likes them.

Changes:
1. Start the strip stack **higher**: first strip sits in the gap between the Home hero and the first content rail (“Suggested for you”).
2. Continue the strips through the Home rails and **stop below Social** (the Social rail / social section currently on Home). Do not drag one wash down the entire page.
3. Make each strip **ever so slightly thinner** than now — about 1–2px, a haircut, not a new graphic.

Do not turn the strips into a full-page sunset gradient. Local strips only.

### Editors → Editors’ Choice
On Home, the rail/chip currently labeled **Editors** becomes **Editors’ Choice**.
Same rail, same contents, sharper name. Do not restyle the rail.

---

## 6. CROWDS — keep the room, add subtype taxonomy

Crowds is not Categories. It stays people-aisles.

Do not kill Crowds. Do not merge Crowds into Home or Find. Emptiness is a seed problem, not proof the room is wrong. Fill aisles with more of the existing catalog where tags allow; do not fake ratings to hide thinness.

### Top row
Keep the existing crowd tabs / chips and their kicker lines exactly:
Kids, Gamers, Socialites, Nerds, Photographers, Musicians, Music lovers, Cinephiles, Teachers, Students, Health nuts, Old men with monocles, Shoppers, News junkies, Wanderlust, The hungry, Umbrella people, Developers, Mood-board people, Stack rats, The impatient — and any others already shipped.

### Second row (new, only after a crowd is selected)
When the user selects a crowd, reveal a **subtype row** under the crowd row.

This is a taxonomy, not a second set of genres.

Examples (use these as the first subtype sets; if a crowd has no honest subtypes yet, show the crowd’s existing rail and no fake chips):

- Musicians → Singers · Producers · DJs · Band members · Session players
- Music lovers → Listeners · Collectors · Radio heads · Vinyl
- Gamers → Solo · Couch · Puzzle · Idle · Competitive
- Photographers → Shooters · Editors · Sharers
- Developers → Weekend · Shipping · Stack rats (only if it does not collide with the Stack rats crowd; if it collides, use Weekend · Shipping · Docs)
- Teachers → Classroom · Homeschool · Tutors
- Kids → Play · Learn · Watch
- Shoppers → Browse · Deal-hunt · Lists
- Health nuts → Train · Track · Recover
- Cinephiles → Watch · Log · Make

Subtype chips filter the aisle to apps **for that role**, not apps in that genre. That is the whole point.

“Musicians” must be able to diverge from “Music lovers.”
- Musicians / Singers = tools to make or perform.
- Music lovers / Listeners = tools to hear, collect, catalog.

If the current engine still filters by genre tag only, add a `for_roles[]` (or equivalent) on listings and match subtypes against that. Do not silently keep genre-equals-crowd. If a listing has no role tags yet, it may appear on the parent crowd but should not appear on a subtype unless tagged.

Kickers stay. Do not rewrite them.

### ARTISTIC LIBERTY (flagged)
Subtype row uses the same chip component already used on Find / Home. No new chip skin. If there is no existing chip component that can sit under the crowd row without a layout rewrite, skip subtypes and leave a builder note rather than inventing a new control.

---

## 7. BOOKMARKS — three doors, one save

Current observed bug: bookmark **tap is dead**. Swipe-to-save on Find works.

Wire all three triggers to the **same save function**:

1. Existing swipe (keep; already works on Find — make it work on Home / Crowds / Games rails too if those rails already document swipe).
2. Bookmark button / bookmark icon tap (currently dead — this is the fix).
3. Long-press on a card / row → save (or unsave if already bookmarked).

Do not add a new share-sheet visual system. If a long-press menu already exists, add Save / Unsave to it. If not, long-press can save immediately with the same toast / confirmation the swipe already uses.

Bookmarks screen copy and hero stay.

---

## 8. GAMES + CROWDS seed (no restyle)

Games and Crowds feel empty because the catalog behind them is thin, not because the rooms are wrong.

This pass:
- Do not merge Games into anything.
- Do not hide emptiness with fake 4.7 stars or invented download counts.
- Prefer filling rails from the existing catalog + honest coming-soon ZAF cards.
- Empty vibe aisles under the VIBE lens may say they are empty. That is correct.

A later packet can be “seed 50 real PWAs through Desk until the three chairs feel like a grind.” Do not do that grind in this pass except as a side effect of tagging provenance.

---

## 9. DO NOT TOUCH

- Games / Crowds / Find / Desk / listing / bookmarks / alerts heroes and looping videos
- Crowds kicker wording
- Opens-not-downloads
- Fake ratings (stay gone)
- A new visual system, new font system, or “make it clearer” copy pass
- Shrinking heroes
- Flattening Crowds into Categories
- Replacing Find with Forge
- Inventing a new profile
- Putting Desk back on the tab bar
- Stripe / live billing
- A sixth bottom tab named Vibe
- Restyling UI when the vibe/all control flips
- Rewriting Home rails except Editors → Editors’ Choice, strip geometry, and lens filtering

---

## 10. DO THIS PASS (order)

1. Rename Census → Forge. Redirect old routes. Keep the room.
2. Reorder tabs: Home · Crowds · Find · Games · Forge
3. Add provenance field to listings. Seed vibe vs pro with the rules in §3. Default unknown to vibe.
4. Add the chrome VIBE / ALL control. Default VIBE. Persist. No UI restyle on flip. Every room reads it.
5. Home hero only: 3D wordmark + larger tagline + cinematic loop. Flagged crack is optional.
6. Home strips: start under hero, stop below Social, shave 1–2px.
7. Rename Editors → Editors’ Choice.
8. Crowds subtype row after crowd select. Role tags, not genre wigs.
9. Bookmark tap + long-press call the same save as swipe.
10. Forge dossier fields + cannot/weakness elimination + seed list in §4.
11. Red listings cannot pretend to be openable.

Stop when the six tests in §0 pass.

---

## 11. What this packet deliberately leaves for later

- Stripe / real $4.99 and $19.99 billing
- “I already pay” becoming a real entitlement
- Dumping Sam’s full on-disk census file into Forge (shape is specified; a file attach from Derek can replace the seed later)
- Mass-seeding Games / Crowds / Desk with hundreds of PWAs
- Crowds engine becoming perfect on every aisle
- Any domain / TLD work
- Any new ZAF product besides cards already in the catalog
