# APPENDIX
## NEXT GROK BUILD ALTERATION PACKET
### Planning-chat handoff from Derek's live walkthrough

**Purpose:** Execute the next Appendix iteration from the existing build. This is not a restart, redesign-from-scratch, or new product brief. Preserve what works. Make the named changes below. Where this packet conflicts with the older planning brief, **this packet wins because it contains Derek's latest live decisions.**

---

# 0. OPERATING RULES FOR THIS PASS

1. **Keep the yard that exists.**
2. Do not remove working rooms, working routes, existing seeded listings, or working gestures unless this packet explicitly replaces them.
3. Do not invent a sixth bottom tab.
4. Do not merge Find and Forge.
5. Do not flatten Crowds into Categories.
6. Desk remains inside Flints. It is not a bottom tab.
7. Paying buys **visibility / eyes**, never stars, never a quality badge.
8. Never fabricate ratings, traffic, opens, downloads, installs, reviews, or engagement numbers to make the yard look busy.
9. Do not add "Free / Paid" labels to PWAs. Derek explicitly wants those removed.
10. Do not add download-size or device-compatibility clutter. This is a web-app yard.
11. Preserve green/red availability status logic and extend it with an amber Coming Soon state.
12. Make changes incrementally. Derek wants each iteration to move a few visual "ticks," not perform wholesale random redesigns.
13. Body copy can remain the current body face unless explicitly named below. Display branding may evolve every iteration.
14. **Important lens override:** the old rule that VIBE and ALL use the same visual skin is no longer current. Derek now explicitly wants the two lenses to have distinct visual treatments while preserving the same information architecture.

---

# 1. PRODUCT POSITIONING

Appendix is not merely a PWA directory.

It is a PWA discovery yard and amateur/vibe-coder ecosystem designed to:

- index PWAs;
- let developers list PWAs for free;
- let developers claim indexed apps;
- make "what was this built with?" first-class information;
- let users browse by **who they are / what they do**, not only by software category;
- encourage ordinary users to become first-time developers;
- collect structured data about builders and build platforms;
- use Forge as the first public-facing slice of Derek's much larger AI-builder Census;
- create a feedback economy through Flints and The Desk;
- sell visibility without selling ratings;
- give independent and amateur developers a credible place to be discovered, reviewed, critiqued, tipped, and compared.

The desired emotional message to non-developers is:

> You do not need experience. You do not need to be good at this. You can make something just for fun, just for yourself, your job, your business, your customers, or one tiny annoyance in your life. If the idea helps anyone else too, even better. Appendix should help you get from "I wish an app existed that..." to "I built one."

That transformation from **user -> participant -> critic -> first-time builder -> developer** is central.

---

# 2. BRAND / NAMING STATUS

## Current working name
**Appendix**

The name is still provisional. Do not hard-wire architecture or data models to the assumption that the public name can never change.

## Current brand language
The yard / scrapyard mythology remains useful, but do not over-explain the pun inside the UI.

Older phrase:
- "the post-apocalyptic SCRAPPYARD / scrAPPyard"

New hero tagline:
- **"Putting the progressive in Progressive Web Apps."**

This new line should be the visible hero tagline in this iteration.

## Display experimentation
Derek explicitly wants each iteration to be allowed to test:

- a different **preview image**;
- a different **display typeface**;
- a different treatment of the stylized **A**.

The display type should feel dimensional, not flat. Explore a credible **3D type treatment**. Do **not** randomly replace every body font across the entire app.

The stylized A should feel anarchist-adjacent without becoming a cliché anarchist symbol. It should use the Appendix spectral-gradient language.

---

# 3. GLOBAL SIZE / DENSITY PASS

Derek wants Appendix more compact than conventional mobile UI.

## Global shrink
Relative to the current UI:

- ordinary app icons: **2 ticks smaller**;
- ordinary text / type: **2 ticks smaller**;
- ordinary card/icon padding: slightly tighter;
- separator / threshold lines: **1 tick thinner**;
- reduce unnecessary whitespace;
- target a visually dense, information-rich mobile canvas.

## Exceptions
Do **not** shrink:

- bottom navigation tabs;
- the Appendix wordmark in the top-left.

If the previously requested tiny enlargement of the top-left wordmark has not yet been made, give it one subtle enlargement and then treat it as frozen.

## Special-card exception
Sponsored and Editor's Choice app art/cards should lose only **1 tick**, not 2, so they remain visibly more important than ordinary listings.

## Top-right controls
Do not shrink the top-right chrome as part of the global shrink.

Instead:

- keep the circles approximately their current size;
- spread them apart slightly to reduce accidental taps;
- color-code them;
- keep Identity visibly larger than the other three;
- make active state much clearer than it is now.

---

# 4. GLOBAL VIBE / ALL VISUAL SYSTEM
## EXPLICIT OVERRIDE OF THE OLD "SAME SKIN" RULE

The content model stays the same, but the visual lens should now visibly transform the yard.

## VIBE mode
VIBE should feel:

- vibrant;
- luminous;
- fluorescent / galactic rather than cheap RGB neon;
- energetic;
- creative;
- spectrum-driven.

Use the spectrum language on:

- separator hairlines;
- top/sub-tab perimeters;
- active states;
- selected controls;
- section accents;
- Bookmarks title / accents;
- top-right chrome accents;
- stylized A;
- special rail title treatments;
- other restrained perimeter / line details.

Do not drown every surface in rainbow fill. Perimeter and hairline usage is preferred where possible.

## ALL mode
ALL should transform into:

- regal black;
- gold;
- rose-gold;
- warm metallic gradients;
- restrained earth tones;
- luxury;
- subtle sheen / tiny glitter behavior in gold;
- clean, professional, expensive.

It can still use gradient logic, but the gradient family becomes black / bronze / rose-gold / gold rather than the VIBE rainbow.

The scrapyard atmosphere can remain in the hero/background, but ALL should feel like a luxury salvage yard rather than the fluorescent vibe-coder version.

## VIBE / ALL control
Move the toggle beneath the top-left Appendix wordmark.

Requirements:

- slightly enlarge the toggle;
- make the selected side unmistakable;
- add a tiny explanation near it if needed so a first-time user understands what VIBE vs ALL changes;
- preserve state across screens.

## Count
Add a small app-count indicator near the top, above the first major separator line.

Examples conceptually:

- `1,284 Vibe Apps`
- `3,906 All Apps`

The number must update to reflect the selected lens.

---

# 5. SPECTRAL GRADIENT LANGUAGE

This is not a random rainbow. It is a repeatable visual system.

## Ordered color families

1. tiny white-hot / silvery-white boundary spark;
2. light / bubblegum pink;
3. magenta / hot magenta;
4. fluorescent red;
5. fluorescent orange;
6. fluorescent yellow;
7. lime / fluorescent green;
8. deeper / forest fluorescent green;
9. bioluminescent turquoise / teal;
10. fluorescent sky blue;
11. galactic / neon navy;
12. deep indigo;
13. violet;
14. regal purple;
15. back toward magenta / pink.

The colors should feel luminous, rich, and "galactic." Avoid flat elementary-color rainbow bars.

## Gradient math concept
The original idea is approximately:

- 5% previous spectrum family;
- 45% dominant color A;
- 45% dominant color B;
- 5% next spectrum family.

The first spectrum segment is special because white is not a full recurring color family. White is a **1-2% boundary flash** used only to mark the cycle seam.

Examples:

### Line 1
Predominantly:
- pink -> red

Edge behavior:
- first 1-2%: white-hot / silvery-white into very light pink;
- dominant body: pink into red;
- final ~5%: orange begins to appear.

### Line 2
- ~5% pink carry-in;
- red -> orange dominant;
- ~5% yellow carry-out.

### Line 3
- ~5% red carry-in;
- orange -> yellow dominant;
- ~5% green carry-out.

Then continue:

- yellow -> green;
- green -> turquoise;
- turquoise -> blue;
- blue -> indigo/purple;
- purple -> pink;
- cycle seam;
- tiny white-hot boundary flash;
- begin again.

## Separator bars
Keep the current separator idea.

Change only:

- make them a tiny hair thinner;
- preserve the gradient;
- add one below the relevant category / letter-tab strip where currently missing.

---

# 6. HOME HEADER / TOP CHROME

Work left to right.

## Appendix wordmark
- top-left remains;
- visually important;
- exempt from global shrink;
- no redundant second giant APPENDIX word inside the hero.

## VIBE / ALL
- directly beneath wordmark;
- slightly larger control;
- clearer selected state;
- optional tiny explanatory microcopy.

## Bookmarks
- active-state indicator must be obvious;
- not merely the same dark circle as inactive;
- apply lens-specific color treatment.

## Flints
The existing color-change behavior when active is liked. Use this as the interaction reference for the other top-right controls.

## Alerts
- clear active state;
- color-coded.

## Identity
- remain the largest top-right circle;
- signed-out state should visibly lead to Sign In;
- signed-in state can show initial or profile image;
- VIBE signed-in perimeter should use a smooth full-spectrum ring:
  pink -> red -> orange -> yellow -> green -> blue -> purple -> pink;
- ALL equivalent should use premium black/gold/rose-gold logic;
- active Identity state should be clearer than just the persistent ring.

---

# 7. HOME HERO
## VISUAL JOB

Replace/evolve the current hero toward something physically plausible and cinematic.

## Remove
- the redundant giant in-hero APPENDIX text;
- floating phones in space;
- phones all sharing the same size, direction, or damage state;
- overly clunky/static motion.

## Desired physical scene
A believable post-apocalyptic technology scrapyard.

Phones/devices should:

- be physically on or emerging from the ground;
- sit at varied distances;
- vary radically in apparent size because of depth;
- face different directions;
- sit at different angles;
- show different levels of decay;
- range from barely damaged to shattered;
- feel like actual objects occupying a real environment;
- include dirt, salvage, vegetation, weeds, built greens, repair activity, debris, etc., where useful.

Some devices can be partly buried. Some can be near camera. Others distant.

## Central hope object
Near dead center:

- one phone/device;
- grounded, not floating;
- still alive/flickering;
- showing a subtle luminous stylized **A**.

This is the "hope survived the scrapyard" visual anchor.

## Motion
Keep it subtle, cinematic, clever.

Possible motion language:

- slow camera creep;
- shallow parallax;
- tiny screen flicker;
- one repair light;
- soft environmental movement;
- tiny glints;
- vegetation movement;
- restrained depth-of-field changes.

Do not make it noisy or theme-park animated.

## Tagline
Bottom-right of hero:

**Putting the progressive in Progressive Web Apps.**

Make it smaller than the current old tagline and cleanly anchored to the lower-right.

The post-apocalyptic scrapyard idea belongs in the visual concept and brand mythology, not as the primary hero tagline this round.

---

# 8. HOME RAIL / CAROUSEL SYSTEM

## Infinite depth
Do not be shy about long rails.

A carousel can contain:

- dozens;
- 100;
- 200;
- more.

Use lazy loading / virtualization as needed.

The user should be able to keep swiping through a substantial catalog.

## Density
Ordinary app tiles should become smaller and denser.

At typical mobile width, ordinary horizontal rows should strive to expose roughly **six compact apps per row** where the current card design allows it.

Special rows may expose fewer because their tiles are intentionally larger.

## Section height rhythm
The Home page should not be monotonous single-row-after-single-row.

Use varying stacked-row heights.

Current directional rhythm:

- 2-row section;
- 1-row section;
- large Sponsored feature;
- 1-row section;
- 2-row section;
- 3-row section;
- large Editor's Choice feature;
- 2-row section;
- 1-row section;
- large Sponsored feature;
- continue rhythmically.

This is a layout rhythm, not a requirement to repeat a literal rigid mathematical loop forever.

## Example weighting
- Trending: 1 row;
- Suggested for You: 2 rows;
- Games: 2 rows;
- Productivity: 2 rows;
- Photo: 1 row;
- Music: 1 row;
- Tools: 2 rows;
- Education: 1 row;
- Social: 1 row.

Alternate 1/2/1/2 where useful, with occasional 3-row heavy sections.

## Sponsored
Sponsored remains selective.

Presentation:

- approximately **1.5 ordinary row heights**;
- approximately **2 ordinary app widths**;
- should look more like a Google Play featured tile than a slightly larger icon;
- use a stronger preview image / artwork where available;
- keep it unmistakably visibility inventory, not a quality badge.

## Editor's Choice
Approximately **1.25 ordinary row heights**.

Slightly larger than normal, but less dominant than Sponsored.

## Suggested / Sponsored / Editor's Choice titles
Keep them visually more important than ordinary genre rails.

Use:

- slightly thicker title treatment;
- stronger type;
- the lens-specific gradient perimeter / title bar language.

Do not make the entire Home page scream. Special rails should stand out because ordinary rails stay disciplined.

---

# 9. TOP / LETTER / SECTION TABS

Where the current UI has compact tab/chip controls such as Suggested, Top Charts, Unconventional, Crowds, Categories, or the A-E controls:

## VIBE
Prefer:

- neutral interior;
- thin spectral-gradient perimeter;
- optionally spectral text if legibility remains excellent.

Derek wants to try the **perimeter-first** treatment before flooding full buttons with color.

## ALL
Use the same geometry but substitute:

- black;
- gold;
- rose-gold;
- warm metallic gradient;
- subtle sheen.

## Games A-E controls
The current Games-page strip that is effectively the A-E / letter-tab control needs the same lens-aware color coding.

Do not label it "category strip" if that is not what it actually is.

---

# 10. BOOKMARKS

## Universal save model
Final gesture logic:

- **swipe right = Save / Bookmark**;
- **swipe left = Peek / Preview**;
- swipe left again = collapse / unpeek;
- **long press = Save / Bookmark** where swiping is unavailable or inconvenient;
- listing detail page must have a visible bookmark control.

This must work from:

- Home;
- Crowds;
- Find;
- Games;
- app detail pages;
- anywhere else a standard app card appears.

## Fix current mislabeled gesture
The current interaction can perform the correct save action while exposing the wrong word ("Peek").

Correct the action label so the visible affordance matches the actual action.

## Peek mode
Peek should be substantially more useful.

When expanded:

- card height should more than double if needed;
- show roughly two concise information lines;
- no witty copy;
- no fluff;
- no Free / Paid;
- show what the app literally does;
- show build platform;
- show category;
- optionally crowd/subtype if space permits;
- keep status indicator.

## Bookmark room structure
Provide:

1. **Bookmarks** - master list;
2. **Favorites**;
3. **one user-customizable collection/tab**.

The custom collection should be user-renamable if straightforward.

## Organizing
From Bookmarks:

- long press to assign an item to Favorites or the custom collection;
- drag-and-drop to reorder manually;
- preserve custom sequence.

## Search
Add an easy-to-access search field.

Behavior:

- live filtering on each keystroke;
- no submit button required for normal use.

## Visual treatment
VIBE:
- vibrant title/accent language.

ALL:
- black/gold/rose-gold.

Bookmark dividers:
- ultra-thin;
- lens-appropriate gradient.

---

# 11. IDENTITY / SIGN-IN

## Signed out
Make Sign In / Create Account substantially more prominent.

Use the phrase:

**Guest of the Yard**

Do not say Guest of the Scrapyard.

## Sign-in CTA copy
The signed-out Identity page should explain that an account unlocks:

- filing/submitting your own apps;
- claiming indexed listings;
- earning Flints;
- joining the critic pool;
- saving and organizing bookmarks;
- beta testing;
- loyalty benefits;
- developer profile/tools;
- competitions;
- voting;
- access to your Desk / Cubicle;
- developer app-management tools after developer onboarding.

Do not make this a wall of tiny legalistic text. Present it as an attractive benefits list.

## Session persistence
Users should be able to remain signed in.

Use secure persistent sessions / "remember me" behavior appropriate to the auth stack.

Do not force login every launch.

---

# 12. FLINTS LANDING PAGE - SIGNED OUT

When a signed-out user taps Flints:

Do not show the full desk rules, pricing math, redemption math, or dead controls.

Instead:

- explain Flints at a high level;
- identify them as Appendix loyalty coins;
- explain that participation earns them;
- explain that they can unlock free benefits, products/services/perks, and promotion;
- keep some discovery / mystery;
- strongly offer Sign In or Create Account directly from this screen.

They can also sign in through Identity.

---

# 13. FLINTS SECONDARY ONBOARDING
## ONLY AFTER SIGN-IN AND ONLY WHEN ENTERING THE FLINTS PROGRAM

This is **not** general account onboarding.

Keep it extremely short.

### Question 1
**Are you familiar with vibe coding?**

### Question 2
Show a practical list of major build platforms.

Ask which ones the user has **heard of / is familiar with**.

- multi-select;
- select as many as applicable;
- `Other` text field;
- comma-separated additional platforms accepted.

### Question 3
Show the platform list again.

Ask which ones the user has **actually used**.

- multi-select;
- same Other behavior.

### Question 4
Ask which categories/types of apps they are generally interested in.

- multi-select;
- use this to improve Desk relevance.

Do not turn this into a résumé questionnaire.

No need to interrogate skill level here.

---

# 14. FLINTS / THE DESK BECOMES A 3D CUBICLE
## MAJOR PRODUCT + VISUAL JOB

The current rules-heavy Flints/Desk page should become an immersive personal cubicle.

## Main cubicle
Visual concept:

- 3D cubicle;
- desk;
- three app "tickets" / app objects available on the desk;
- monitor/computer;
- small personal wall details / pictures;
- believable stereotypical cubicle touches;
- polished, not cartoonishly cluttered.

The main cubicle should not be covered in operational text.

## Remove from main cubicle
Move these away from the primary scene:

- "The Desk always three";
- raw earning-rule copy;
- pricing-plan numbers;
- `I already pay $4.99` checkbox;
- current dead "Redeem Billboard" button;
- long textual instructions;
- any other debug-like operational copy.

## Computer monitor = mini-app inside the app
The monitor is clickable.

Inside it, create a compact multi-menu workspace containing:

### A. How Flints Work
- rules;
- earning methods;
- reward explanations;
- current balance/history if available.

### B. Redemption
- redeem earned Flints;
- current provisional redemption:
  **24 Flints = one week of sponsored promotion for one app**;
- treat 24 as configurable, not hardcoded forever.

### C. Developer
- "Become a Developer" entry;
- super-short developer onboarding;
- developer rules;
- claim/manage apps;
- edit claimed listings;
- submit new apps;
- view own apps;
- listing tools;
- sponsorship/pricing information.

### D. Pricing / Promotion
Keep paid promotion details here and/or under Identity/Developer tools, not splashed across the cubicle.

---

# 15. DESK CONTENT / SKIP RULES

## Number of active apps
Keep exactly three visible app opportunities on the desk at a time.

Do not write "always three" on the UI. Just behave that way.

## Sponsored mix
Original logic was 2 sponsored + 1 random.

Latest live direction loosens this:

- aim for **at least two sponsored** when inventory exists;
- all three may be sponsored if that is the available/desired campaign mix;
- if sponsored inventory is thin, fill responsibly from catalog;
- never leave holes.

Do not label sponsored Desk chairs in a way that tells the critic which review is paid if Derek's existing blind-review logic is still intended.

## Skip
Fix Skip.

Rules:

- maximum **3 skips per user per day**;
- skipping replaces only that chair;
- keep three available;
- after daily limit, disable skip cleanly and explain when it resets.

## No repeats after completion
Once a user successfully completes and is credited for an app:

- mark it completed for that user;
- never place that app on that user's Desk again.

---

# 16. DESK REVIEW / CRITIQUE ECONOMY

## Required submission components
To complete an app critique for a baseline Flint reward, require:

1. meaningful app exploration;
2. **a 1-to-5 star rating**;
3. public review;
4. private developer critique.

### Important rating interpretation
The reward must **not depend on giving five stars**.

The spoken phrase "five-star rating" is interpreted here as "a rating on a five-star scale" because requiring a positive score would conflict with Appendix's locked rule that nobody buys or earns stars.

## Baseline reward
**1 Flint** for a completed qualified critique.

Current internal baseline:

- at least **2 minutes** of meaningful app exploration;
- minimum **150 characters** public review;
- minimum **150 characters** private critique;
- required 1-5 star rating.

"Meaningful exploration" should not be raw idle time.

Track privacy-conscious behavioral evidence such as:

- foreground time;
- navigation;
- clicks/taps;
- swipes;
- route changes;
- other genuine interaction.

Do not reward someone for opening the app and leaving the phone untouched.

## Bonus Flint logic
Do not publish the exact thresholds prominently.

Tell users only that deeper, more useful engagement can earn bonus Flints.

Internal current thresholds:

### Time bonus
- at least **5 minutes** of meaningful exploration:
  **+1 Flint**

### Depth bonus
- combined public review + private critique exceeds **750 characters**:
  **+1 Flint**

These can stack.

The intent is:
- most normal qualified reviews earn 1;
- genuinely deeper work can earn more.

Do not encourage padding / spam merely to cross character counts. Add basic quality/spam detection.

---

# 17. ADDITIONAL FLINT EARNING

## Verified broken app/link
A genuinely broken URL / unavailable app, once verified:

**+2 Flints**

This should be relatively rare and valuable.

Prevent repeated rewards for the same known outage.

## Verified incorrect listing information
If a user identifies genuinely incorrect metadata and the correction is verified:

**+2 Flints**

Examples:
- wrong developer;
- wrong builder platform;
- inaccurate category;
- stale version/release info;
- dead external link;
- other material error.

## Screenshots
User-contributed listing screenshots:

- every **3 approved screenshots = 1 Flint**;
- recommend **6 screenshots = 2 Flints** as a useful contribution target.

Avoid duplicates, unusable crops, blank screens, irrelevant images, and spam.

## Screen recording / walkthrough video
User-contributed video:

- **45 seconds to 1 minute 20 seconds = 2 Flints**
- **1 minute 20 seconds and longer = 3 Flints**

UX copy should recommend keeping longer recordings around **2 minutes**, not rambling indefinitely.

A video can be:

- screen recording;
- walkthrough;
- amateur demo;
- mini review;
- promotional-style demo if honest and useful.

## Moderation clock
Submitted screenshots/videos go to a review queue.

### After 48 hours
If human/community review has not happened:

- contributor receives the applicable Flints anyway.

### After 72 hours
If no review has occurred:

- media becomes automatically approved/published.

Still retain:
- report/removal mechanisms;
- automated basic safety/spam checks if available.

---

# 18. CLAIMING AN INDEXED APP

Every unclaimed listing should visibly offer:

**"Is this you? Are you the developer of this app? Claim this app."**

## Reward
Approved ownership claim:

**3 Flints**

## Completion bonus
After claiming, developers can earn additional Flints by filling meaningful missing information.

Early-yard listings will have holes, so make filling those holes productive.

Potential total from claim + useful enrichment can reasonably reach **5-6+ Flints**, depending on what was missing.

Do not reward meaningless field-churn.

Ownership verification method can be practical:
- domain proof;
- repo proof;
- known developer account;
- email/domain verification;
- other builder-supported ownership check.

---

# 19. APP SUBMISSION / FILING

Submitting a PWA should be **free**.

Strongly encourage free listing.

## First-pass philosophy
A developer should be allowed to do the bare minimum today and come back next week to improve the listing.

Make this explicit:

> Publish the basic listing now. Add the polished video, longer description, extra screenshots, metadata, and developer details later.

Do not make first submission feel like a tax return.

## Mandatory first-pass fields
Keep mandatory fields minimal.

At minimum:

- app name;
- app URL;
- developer/maker identity or temporary attribution;
- **what platform/builder it was built with**;
- primary category;
- relevant Crowd;
- live vs Coming Soon;
- at least **2 screenshots/images**.

## Media
Screenshots:

- minimum 2 at initial developer submission;
- support roughly 2-10;
- additional images can be added later.

Video:

- optional;
- one main video slot initially;
- can be commercial, walkthrough, demo, or screen recording;
- can be added later.

## Structured optional questionnaire
After the essential fields, offer an optional "help people understand how this was built" questionnaire.

Useful questions include:

- Was this your first app?
- Beginner / intermediate / advanced?
- Did you consider yourself a developer before building it?
- Was the platform easy?
- Could this realistically be built on the platform's free tier?
- Was this version actually built on a free tier?
- Was it built in under 24 hours?
- Is it production-ready?
- What was hardest?
- What was surprisingly easy?
- Did another tool/platform need to be stitched in?
- Would you recommend this builder to another beginner?
- Other useful Census-style structured fields.

Make clear that optional answers improve:
- discoverability;
- builder comparisons;
- Forge recommendations;
- the ecosystem's platform intelligence.

---

# 20. COMING SOON / PREVIEW LISTINGS

Allow developers to post a preview before the app is live.

## Status
Add a third status:

- green = Live / working;
- red = Dead / unavailable / broken;
- amber = Coming Soon / Preview.

## Preview listing
Can contain:

- screenshots;
- concept images;
- optional video;
- description;
- developer contact;
- "Volunteer for Beta" / beta-interest control;
- additional developer-supplied information.

Do **not** show an active Open PWA button if there is nothing to open.

## Time limit
Coming Soon is temporary.

Target:

- 2-4 week window;
- hard max around **4 weeks**;
- if it has not become live by the deadline, remove/unpublish the preview unless explicitly renewed through an allowed admin workflow.

Avoid an eternal graveyard of fake coming-soon vaporware.

---

# 21. APP DETAIL PAGE
## Google Play-inspired information density, but adapted to PWAs

The detail page should feel more like a mature app-store listing.

## Header
Show:

- app name;
- developer directly beneath;
- developer name is tappable;
- live status dot;
- builder/platform ("Built with ...");
- category;
- Crowd;
- Crowd subtype/role where useful.

## Remove
- Free / Paid;
- download size;
- device-platform compatibility clutter;
- other irrelevant native-app metadata.

## Offline
Offline capability can remain an optional informational field if known.

Do not make it mandatory or visually prominent.

## Screenshots
Current screenshot thumbnails are too small and not tappable.

Change:

- slightly larger preview images;
- tap opens full-screen/lightbox gallery;
- swipe through gallery;
- support developer and approved community images.

## Video
Optional video should sit naturally with the screenshot gallery.

## About
Use two levels.

### Collapsed
Short, concise description.

### Expanded
Tap/click to reveal a significantly richer About section.

The expanded area can include:

- full developer description;
- what the app does;
- release date;
- current version;
- most recent update date;
- recent-update notes / changelog;
- copyright / developer / admin information;
- GitHub repository if one exists and can be verified;
- AI-generated review summary;
- externally sourced rating information if legitimate;
- Appendix's own rating shown separately;
- provenance / builder platform;
- useful technical/public metadata.

Developer can enrich this after claiming the app.

## Ratings
Clearly separate:

- **Appendix rating**
from
- **external rating(s)**.

Never blend external and Appendix scores into one unexplained number.

Always name/source external rating data.

## Reviews
On the detail page, show a representative review sample.

Current preference:

- top **3 strongest/helpful positive reviews**;
- plus **1 lowest/critical review**.

Do not hide criticism to make an app look better.

Tap to open all reviews.

## Similar
Add horizontal carousel:

**Similar Apps**

## More by developer
Below Similar:

**More by [Developer]**

---

# 22. DEVELOPER PAGE

Tapping developer name opens a developer profile/page.

Include:

- developer name;
- developer bio/details if supplied;
- their apps;
- claimed/unclaimed relationship status as applicable;
- builder/platform history where useful;
- message button;
- tip button.

## Messaging
Users should be able to contact a developer through Appendix without Appendix exposing unnecessary private contact data.

## Tipping
Allow users to tip developers.

Current desired Appendix platform fee:

**11.7%**

It is intentionally specific.

### Important implementation boundary
No payment processor has been formally authorized in the older build brief.

Therefore:

- design the tip flow and fee logic;
- do not invent Stripe or another processor without approval;
- if no existing payment stack is available, scaffold rather than fake a successful transaction.

---

# 23. "CONTRIBUTE TO THIS APP" UNIVERSAL ACTION

A user should not need to wait for an app to randomly land on their Desk.

On every eligible app detail page, provide one consolidated contribution action, conceptually:

**Contribute / Improve This Listing**

Inside it, eligible users can:

- Add to My Desk / Take This Review;
- write public review;
- write private critique;
- submit screenshots;
- submit video/screen recording;
- report broken app;
- correct inaccurate metadata;
- contribute verified external metrics;
- other approved enrichment.

This becomes the central doorway for earning Flints against a specific listing.

---

# 24. TRAFFIC / OPEN / POPULARITY DATA

## Appendix data
Track and show genuine:

- opens from Appendix;
- review count;
- save/bookmark count if appropriate;
- other first-party metrics.

Call them what they are.

Do not call an "Open" a "Download."

## External/historical data
Derek wants a more complete sense of an app's historical reach where public information actually exists.

Investigate whether the system can collect verifiable public data such as:

- Google Play download ranges if the PWA/native companion is genuinely listed there;
- other app-store public metrics;
- public web traffic counters where legitimately exposed;
- GitHub stars/forks/releases where relevant;
- product/community stats published by the maker;
- other clearly sourced public reach metrics.

### Hard rule
Never manufacture a respectable-looking large number merely because Appendix's own open count is zero.

If no reliable external metric exists:

- show no external number;
- or show `External reach not available yet`.

## Grok bot feasibility question
Investigate whether a Grok bot/agent can perform a recurring systematic enrichment pass across Appendix listings during the day, gathering public information such as:

- current availability;
- favicon/app icon;
- manifest metadata;
- builder/provenance clues;
- public version/release info;
- public app-store stats;
- GitHub link;
- public external ratings;
- verified traffic/reach indicators;
- stale/broken link detection.

The bot must respect:

- robots.txt where applicable;
- site terms;
- rate limits;
- public-data boundaries;
- no bypassing authentication or private analytics.

Report feasibility and recommended architecture. Do not fake unavailable stats.

---

# 25. CROWDS

The core philosophy is reaffirmed:

**Crowds are people-aisles, not genres.**

Examples:

- "Musicians" rather than "Music";
- then subtype:
  Singer, Producer, DJ, Band Member, Session Player, etc.

Category still exists as metadata.

Crowd answers:

> "Who is this useful to?"

Category answers:

> "What kind of software is this?"

Keep both.

## Crowds empty-space issue
The existing Crowds plate still has a negative-space problem.

Derek wants it filled rather than left as a lonely empty hole.

Do not turn Crowds into Categories.

Preferred direction remains:

- wrapped crowd chips;
- subtype information available more readily;
- denser plate;
- no lone horizontal scroller stranded in empty space.

Do not rewrite locked Crowd names/kickers unless specifically instructed.

---

# 26. FIND
## "What should this app do for me?"

Find is discovery and filtering, not Forge.

## Process
Selections should **eliminate** non-matches rather than feeling like the user picked one magic answer.

Every choice narrows the live result set.

## Category -> Subcategory
When user selects Category:

- reveal Subcategory below it;
- continue narrowing.

## Crowd integration
Find should also strongly support:

- Crowd;
- Crowd subtype/role.

This is a differentiator. Do not reduce Find to ordinary app-store genre filters.

## Built On
Keep and expand the Built-on-builder route here.

This should become a **comprehensive builder/platform carousel or directory**.

Examples include:

- Grok Build;
- ChatGPT/Codex;
- ChatGPT Sites if applicable;
- Gemini / Google AI Studio;
- Lovable;
- Base44;
- Replit;
- Bolt;
- Emergent;
- Bubble;
- Wix;
- other relevant builders from Derek's Census.

The list can be long. Length is not a problem.

Tapping a builder should show:

- all indexed apps built with that builder;
- ratings/results;
- examples;
- useful platform stats later.

This is where someone can answer:

> "What kinds of apps does Gemini actually produce?"
> "Show me everything people built with Lovable."

## Find control visuals
VIBE:
- spectrum-outline controls.

ALL:
- black/gold controls.

## Find card gestures
Final:

- swipe left = Peek;
- swipe left again = collapse;
- swipe right = Bookmark;
- long press = Bookmark.

## Remove
Free/Paid filter.

---

# 27. GAMES

Keep Games as a room.

The current problem is thin inventory, not that Games is conceptually wrong.

## Layout
- make ordinary game rails denser;
- use **2-row sections** as the normal Games rhythm;
- smaller ordinary game cards;
- substantially more rows/categorizations as catalog permits;
- keep long carousels;
- do not fake ratings or duplicate filler.

## Separators
- thinner;
- add missing hairline below the relevant A-E/tab strip.

## A-E / tab controls
- lens-aware gradient perimeters in VIBE;
- black/gold treatment in ALL.

## Mini-game vibe coder
Derek wants a feasibility investigation for a very small built-in mini-game creator, inspired by the idea that some lightweight tools can produce rudimentary tiny games.

Desired scope is intentionally modest:

- extremely simple;
- no-code/vibe-code;
- basic bullshit games are acceptable;
- ideal home would be inside Games.

Potential examples:
- tap game;
- memory match;
- trivia;
- simple endless clicker;
- tiny maze;
- reaction game.

### Do not build a giant game engine this pass.
First answer:

1. Can the current Grok Build stack support a safe lightweight mini-game generator/editor?
2. Can generated games be stored/published as small web apps inside Appendix or exported as PWAs?
3. What is the smallest credible MVP?
4. What security/runtime sandboxing would be needed?
5. Would this materially bloat the current build?

If feasible, propose the smallest possible version before implementation.

---

# 28. FORGE
## MAJOR PRODUCT SIMPLIFICATION

Forge is where Derek's Census begins to shine.

Current Forge is too busy.

Derek does not want a screen full of:

- nodes;
- classifications;
- vague factory taxonomies;
- too many buttons;
- unexplained categories;
- technical decision clutter.

## Desired interaction
Forge should feel like guided onboarding.

At entry:

1. one large text box:
   **"What do you want to build?"**
2. guided selections/dropdowns;
3. each answer narrows/eliminates platforms;
4. next question adapts to the previous answer;
5. persistent **Start Over** button.

Example:

User says:
> "I want an app."

Next questions should be specifically about app needs.

If they say website, the branch changes.

Possible guided dimensions:
- website vs app vs both;
- accounts/login;
- payments;
- scheduling;
- marketplace;
- media upload;
- real-time chat;
- database;
- AI;
- automation;
- mobile/PWA needs;
- ecommerce;
- code ownership/export;
- budget/free-tier constraint;
- skill level;
- speed;
- integrations.

Do not dump all dimensions on the first screen.

## Elimination model
Forge is process-of-elimination.

Platforms that cannot meet a **required** capability are removed.

The system should explain why they were cut.

Final output can preserve the existing logic:

- exactly **3 best fits**
- plus **1 clearly sponsored builder**

## Census grounding
Matching should come from structured Census capability fields.

Not keyword luck.

Forge today is only the first public slice of Derek's much larger Census. Keep architecture expandable.

## "Factories" terminology
The current Forge UI contains classifications such as:

- Any;
- Amateur;
- Vibe;
- Internal;
- "elcap" / similarly unclear label.

Derek does not understand why these are there or what they mean.

### Builder action
Before preserving these controls, provide a plain-English explanation of:

- what each current classification means;
- what data it actually filters;
- why it exists.

Then simplify aggressively.

Derek has **not yet committed** to the word "Factories" as final public terminology.

Do not force users to classify themselves into obscure platform taxonomies just to use Forge.

## Separate Forge from builder browsing
Browsing all platforms and seeing every app built on each platform belongs primarily in **Find -> Built On**.

Forge is for:

> "I have an idea. What should I build it with?"

Find is for:

> "Show me what this builder/platform has produced."

---

# 29. TOP CHARTS

For now:

**Top Charts = highest genuine Appendix open count.**

Do not complicate this pass unless trivial.

Future possibility:
- distinguish all-time popularity from fast-rising Trending.

Do not invent popularity data.

---

# 30. DEVELOPER EVOLUTION / NON-DEVELOPER FUNNEL

This should become a core acquisition loop.

## Initial account onboarding
Keep general account creation extremely short.

After basic signup, ask lightly:

**Are you a developer, regardless of skill level?**

If yes:
- do not interrogate;
- let them reach developer tools later.

If no:
gently ask whether they have ever thought:

- "I wish there were an app that..."
- "Something could make my job easier..."
- "My business/customers could use..."
- "I want a tiny personal tool..."

Encourage them.

Core copy philosophy:

- no coding experience required;
- no design experience required;
- it can be just for fun;
- it can solve only their own problem;
- personal usefulness is enough;
- Appendix can help them figure out where/how to build it;
- reviewing other apps can earn Flints toward promoting their own future app.

The system should make an ordinary person think:

> "Wait. I could actually make one?"

That is a major Appendix differentiator.

---

# 31. BUILDER / PLATFORM INTELLIGENCE LOOP

Each app's builder provenance should feed a growing comparison dataset.

Eventually Appendix should be able to answer questions such as:

- Which builder produces the highest-rated visual design?
- Which builder is most beginner-friendly?
- Which builder produces the most production-ready apps?
- Which apps were built entirely on free tiers?
- Which builders most often require stitching another tool?
- Which builders produce apps inside 24 hours?
- What do users actually think of apps built on each platform?
- What kinds of apps does each platform appear strongest at?

This is where developer-submission questionnaire data, Desk results, public reviews, and Derek's Census begin reinforcing each other.

Do not need to expose all of these statistics this pass, but **store the data in a way that makes them possible later**.

---

# 32. SPONSORSHIP / MONEY

Preserve existing core philosophy:

**Paying buys eyes.**

Not:
- ratings;
- positive reviews;
- stars;
- quality labels.

Existing working reference points:

- `$4.99/mo` Home Billboard;
- `$19.99/mo` sponsored Desk pool.

Derek has also discussed higher-volume developer promotion / enterprise arrangements outside these standardized plans.

Keep monetary architecture modular.

## Flint redemption
Current provisional reward:

**24 Flints = one week sponsored promotion for one app.**

This costs Appendix little/no direct inventory cost while saving the user real promotional money.

That is intentional.

Keep 24 configurable.

---

# 33. SPECIAL VISUAL / INTERACTION DETAILS

## Active top-right state
Use Flints' current selected-state behavior as the model.

Bookmarks, Alerts, and Identity should gain equally obvious selected states.

## Green/red/amber status
- green = live now;
- red = broken/offline/dead;
- amber = preview/coming soon.

## Screenshot/gallery behavior
Tappable everywhere a screenshot preview appears.

## No dead buttons
Any visible CTA must:
- work;
- be disabled honestly;
- or be removed.

No decorative "Redeem" button that does nothing.

---

# 34. DO NOT TOUCH / DO NOT REGRESS

Do not:

- add a sixth bottom tab;
- merge Find and Forge;
- move Desk onto bottom nav;
- flatten Crowds into Categories;
- fake ratings;
- fake opens;
- fake external traffic;
- fake downloads;
- call Opens Downloads;
- reintroduce Free/Paid labels;
- add irrelevant download-size fields;
- force native-platform compatibility fields;
- shrink bottom nav;
- shrink Identity below other top-right circles;
- silently replace the whole body type system;
- make every section a rainbow-filled slab;
- force developer onboarding into general signup;
- put the Flints secondary onboarding outside Flints;
- put pricing/rules clutter all over the cubicle;
- reward positive stars;
- show unfinished Coming Soon items forever;
- remove Games simply because current inventory is thin;
- replace Forge with Find;
- create a second unrelated builder/platform taxonomy.

---

# 35. ORDER OF EXECUTION
## Recommended next build sequence

### JOB 1 - Functional bugs / dead interactions
1. Fix Bookmark gesture labels/logic.
2. Add long-press bookmark on Home/Crowds/Games/other non-swipe contexts.
3. Add bookmark button on listing detail.
4. Make screenshots tappable.
5. Fix Desk skip behavior and 3/day limit.
6. Remove dead redemption / pay checkbox controls from main Desk.
7. Make top-right active states consistent.

### JOB 2 - Global density + chrome
1. 2-tick ordinary icon shrink.
2. 2-tick text shrink.
3. 1-tick separator shrink.
4. tighter card padding.
5. preserve bottom nav.
6. preserve/emphasize top-left Appendix.
7. slightly spread top-right circles.
8. keep Identity largest.
9. move VIBE/ALL beneath wordmark.
10. app-count indicator.

### JOB 3 - VIBE / ALL visual system
1. implement VIBE spectrum perimeter/hairline language;
2. implement ALL black/gold/rose-gold luxury language;
3. color-code tab/chip perimeters;
4. active top-right states;
5. preserve layout while lens skin changes.

### JOB 4 - Home hero
1. grounded physical scrapyard;
2. varied broken devices;
3. central flickering A device;
4. remove redundant giant in-hero APPENDIX;
5. new bottom-right tagline;
6. subtle cinematic motion;
7. new 3D display type experiment / preview image iteration.

### JOB 5 - Home rail density/rhythm
1. long/infinite carousels;
2. 1/2/3-row section rhythm;
3. Sponsored 1.5-row / ~2-column tile;
4. Editor's Choice 1.25-row;
5. special titles;
6. no fake filler.

### JOB 6 - Bookmarks room
1. master / Favorites / custom collection;
2. live search;
3. drag reorder;
4. long-press organization;
5. improved Peek;
6. lens visuals.

### JOB 7 - Listing detail overhaul
1. metadata/header;
2. larger tappable gallery;
3. expandable About;
4. reviews;
5. similar apps;
6. more by developer;
7. claim;
8. contribute;
9. message/tip developer;
10. verified external metadata architecture.

### JOB 8 - Flints / Cubicle
1. signed-out landing;
2. Flint-only onboarding;
3. 3D cubicle;
4. monitor mini-app;
5. three Desk apps;
6. reward logic;
7. media/data contribution logic;
8. developer workspace.

### JOB 9 - Find refinement
1. elimination-style narrowing;
2. Crowd + Category/Subcategory;
3. long Built-on directory;
4. gestures;
5. no Free/Paid.

### JOB 10 - Games density
1. 2-row emphasis;
2. more real categorizations/content;
3. A-E color system;
4. mini-game builder feasibility report.

### JOB 11 - Forge simplification
1. remove clutter;
2. text-box + guided adaptive wizard;
3. Start Over;
4. capability elimination;
5. 3 fits + 1 sponsored;
6. explain/clean current Factory classifications;
7. retain Census-expandable architecture.

---

# 36. QUESTIONS / FEASIBILITY REPORTS GROK BUILD SHOULD ANSWER

Do not block obvious work while answering these.

1. **Public external metrics:** What legitimate public metrics can we automatically collect for indexed PWAs without inventing traffic numbers?
2. **Grok bot:** Can a Grok bot/agent enrich/verify listings on a recurring basis, and what exact public information can it safely collect?
3. **Mini-game creator:** What is the smallest credible embedded no-code/vibe-code mini-game builder possible in the current stack?
4. **Current Forge labels:** What do Any / Amateur / Vibe / Internal / "elcap" currently mean in the code and data model?
5. **Tip payments:** What payment capability, if any, already exists? Do not add a processor without authorization.
6. **Claim verification:** What ownership-verification method best fits the current architecture?
7. **Coming Soon expiration:** What is the cleanest automated way to expire preview listings at 4 weeks?
8. **User-contributed media moderation:** What lightweight automated checks can run before the 48/72-hour fallback timers?
9. **Engagement measurement:** What privacy-conscious, abuse-resistant metrics can measure meaningful PWA exploration without pretending idle foreground time is engagement?

---

# 37. TEST WHEN DONE

## Global
- VIBE and ALL both preserve all functionality.
- VIBE visually transforms into spectrum language.
- ALL visually transforms into black/gold/rose-gold.
- lens state persists across screens.
- app count changes with lens.
- no layout becomes unreadably small.
- bottom nav unchanged.

## Header
- VIBE/ALL control clear.
- Bookmarks/Flints/Alerts/Identity each visibly indicate active state.
- Identity remains largest.
- signed-in initial/photo works.

## Home
- hero loads smoothly.
- no redundant center APPENDIX.
- tagline reads correctly.
- rails support long catalogs without jank.
- Sponsored / Editor's Choice dimensions differ correctly.
- no fake filler.

## Bookmarks
- right swipe saves.
- left swipe peeks.
- second left collapse works.
- long press saves.
- detail-page bookmark works.
- search filters per keystroke.
- Favorites/custom collection work.
- drag reorder persists.

## App detail
- developer name opens developer page.
- screenshots open gallery.
- About expands/collapses.
- internal/external ratings clearly separated.
- Similar and More by Maker load.
- claim flow works.
- contribution flow works.
- red/green/amber states behave correctly.

## Flints
- signed-out page explains + offers login.
- secondary onboarding appears only after login and only for Flints participation.
- cubicle renders.
- exactly 3 app opportunities remain available.
- skip replaces one chair.
- fourth skip in a day is blocked.
- completed app never returns for that user.
- baseline critique reward works.
- bonus logic works.
- broken/info rewards cannot be farmed repeatedly.
- media timers behave at 48h / 72h.
- 24-Flint redemption is inside monitor and configurable.

## Find
- every parameter narrows results.
- Category reveals Subcategory.
- Crowd/Subtype works.
- Built-on platform directory works.
- Free/Paid is gone.

## Games
- more dense than current.
- 2-row rhythm works.
- no fake ratings.
- A-E/tab color system tracks lens.

## Forge
- first screen is simple.
- text + guided branch.
- Start Over works.
- questions adapt.
- incapable platforms are eliminated.
- cut reasons shown.
- results are 3 fits + 1 sponsored.
- no Find/Forge merge.

---

# 38. NORTH STAR

Appendix should increasingly feel less like:

> "Here is a list of PWAs."

and more like:

> "Here is where ordinary people discover what the open web can do, see what other amateurs built, learn which AI/no-code builder actually produced it, critique it, improve the yard, earn enough visibility to promote their own work, and eventually realize they can build something too."

That is the product.

Do not sand that down into a generic app directory.
