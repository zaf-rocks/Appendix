import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { authMiddleware } from "@/lib/auth/middleware";
import { getSql } from "@/lib/db";
import { GENRE_META, SEED } from "@/lib/catalog";
import { inferProvenance } from "@/lib/provenance";
import { isWellEmail } from "@/lib/well";

async function ensureWell(sql: Awaited<ReturnType<typeof getSql>>) {
  await sql.query(`alter table listings add column if not exists status text not null default 'live'`);
  await sql.query(`
    create table if not exists link_reports (
      id serial primary key,
      listing_id text not null,
      created_at timestamptz not null default now()
    )
  `);
  await sql.query(`create index if not exists link_reports_listing_idx on link_reports (listing_id)`);
  await sql.query(`
    create table if not exists well_mod (
      listing_id text primary key,
      hidden boolean not null default false,
      dead boolean not null default false,
      updated_at timestamptz not null default now()
    )
  `);
  await sql.query(`alter table well_mod add column if not exists hold_until timestamptz`);
  await sql.query(`alter table flint_ledger add column if not exists user_id text`);
  await sql.query(`alter table reviews add column if not exists private_body text`);
  await sql.query(`
    create table if not exists yard_events (
      id serial primary key,
      listing_id text not null,
      kind text not null,
      created_at timestamptz not null default now()
    )
  `);
  await sql.query(`create index if not exists yard_events_kind_idx on yard_events (kind, created_at desc)`);
  await sql.query(`
    create table if not exists flint_ledger (
      id serial primary key,
      amount int not null,
      reason text not null default 'issued',
      created_at timestamptz not null default now()
    )
  `);
  await sql.query(`
    create table if not exists suggestions (
      id serial primary key,
      kind text not null default 'idea',
      body text not null,
      email text,
      created_at timestamptz not null default now()
    )
  `);
  await sql.query(`
    create table if not exists sponsor_runs (
      id serial primary key,
      listing_id text not null,
      kind text not null,
      days int not null default 7,
      starts timestamptz not null default now(),
      ends timestamptz not null
    )
  `);
}

function labelOf(id: string, names: Map<string, string>) {
  return names.get(id) || SEED.find((a) => a.id === id)?.name || id;
}

async function assertWell(userId: string) {
  if (process.env.NODE_ENV !== "production") return;
  try {
    const sql = await getSql();
    const rows = await sql<{ email: string | null }>`select email from "user" where id = ${userId}`;
    if (isWellEmail(rows[0]?.email)) return;
  } catch {
    /* no user table */
  }
  throw new Error("Not found");
}

export const fileLinkReport = createServerFn({ method: "POST" })
  .validator(z.object({ listingId: z.string().min(1).max(80) }))
  .handler(async ({ data }) => {
    const sql = await getSql();
    await ensureWell(sql);
    await sql`insert into link_reports (listing_id) values (${data.listingId})`;
    try {
      await sql`insert into yard_events (listing_id, kind) values (${data.listingId}, ${"report"})`;
    } catch {
      /* events table may not exist yet on first call */
    }
    return { ok: true as const };
  });

export const recordYardEvent = createServerFn({ method: "POST" })
  .validator(
    z.object({
      listingId: z.string().min(1).max(80),
      kind: z.enum(["open", "save", "report"]),
    }),
  )
  .handler(async ({ data }) => {
    try {
      const sql = await getSql();
      await ensureWell(sql);
      await sql`insert into yard_events (listing_id, kind) values (${data.listingId}, ${data.kind})`;
    } catch {
      /* analytics must never block opening an app */
    }
    return { ok: true as const };
  });

export const recordFlints = createServerFn({ method: "POST" })
  .validator(
    z.object({
      amount: z.number().int().min(1).max(50),
      reason: z.string().min(1).max(80),
    }),
  )
  .handler(async ({ data }) => {
    try {
      const sql = await getSql();
      await ensureWell(sql);
      await sql`insert into flint_ledger (amount, reason) values (${data.amount}, ${data.reason})`;
    } catch {
      /* never block a review over a ledger write */
    }
    return { ok: true as const };
  });

export const submitSuggestion = createServerFn({ method: "POST" })
  .validator(
    z.object({
      kind: z.enum(["idea", "question", "concern", "comment"]),
      body: z.string().min(12).max(800),
      email: z.string().email().optional().or(z.literal("")),
    }),
  )
  .handler(async ({ data }) => {
    const sql = await getSql();
    await ensureWell(sql);
    await sql`insert into suggestions (kind, body, email) values (${data.kind}, ${data.body}, ${data.email || null})`;
    try {
      await sql`insert into flint_ledger (amount, reason) values (${1}, ${"suggestion"})`;
    } catch {
      /* */
    }
    return { ok: true as const, shards: 1 };
  });

export const startSponsor = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator(
    z.object({
      listingId: z.string().min(1).max(80),
      kind: z.enum(["paid", "flint"]),
      days: z.union([z.literal(7), z.literal(30)]),
    }),
  )
  .handler(async ({ data, context }) => {
    const sql = await getSql();
    await ensureWell(sql);
    const ends = new Date(Date.now() + data.days * 86400000).toISOString();
    await sql`insert into sponsor_runs (listing_id, kind, days, starts, ends) values (${data.listingId}, ${data.kind}, ${data.days}, now(), ${ends}::timestamptz)`;
    if (data.kind === "paid") {
      const amount = data.days === 30 ? 6 : 3;
      await sql`insert into flint_ledger (amount, reason, user_id) values (${amount}, ${`sponsor:${data.listingId}:${data.days}`}, ${context.userId})`;
    }
    return { ok: true as const, flints: data.kind === "paid" ? (data.days === 30 ? 6 : 3) : 0 };
  });

export const awardFlints = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator(
    z.object({
      amount: z.number().int().min(1).max(12),
      reason: z.string().min(1).max(80),
    }),
  )
  .handler(async ({ data, context }) => {
    const sql = await getSql();
    await ensureWell(sql);
    const reason = data.reason;
    const prior = await sql<{ id: number }>`select id from flint_ledger where user_id = ${context.userId} and reason = ${reason} limit 1`;
    if (prior.length && !reason.startsWith("review")) {
      const rows = await sql<{ n: number }>`select coalesce(sum(amount), 0)::int as n from flint_ledger where user_id = ${context.userId}`;
      return { ok: true as const, balance: rows[0]?.n ?? 0, already: true as const };
    }
    await sql`insert into flint_ledger (amount, reason, user_id) values (${data.amount}, ${reason}, ${context.userId})`;
    const rows = await sql<{ n: number }>`select coalesce(sum(amount), 0)::int as n from flint_ledger where user_id = ${context.userId}`;
    return { ok: true as const, balance: rows[0]?.n ?? data.amount, already: false as const };
  });

export const myFlintBalance = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .handler(async ({ context }) => {
    try {
      const sql = await getSql();
      await ensureWell(sql);
      const rows = await sql<{ n: number }>`select coalesce(sum(amount), 0)::int as n from flint_ledger where user_id = ${context.userId}`;
      return { n: rows[0]?.n ?? 0 };
    } catch {
      return { n: 0 };
    }
  });

export const strikeWeekReviews = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator(z.object({ listingId: z.string().min(1).max(80) }))
  .handler(async ({ context, data }) => {
    await assertWell(context.userId);
    const sql = await getSql();
    await ensureWell(sql);
    await sql`delete from reviews where listing_id = ${data.listingId} and created_at > now() - interval '7 days'`;
    return { ok: true as const };
  });

export const takeFlints = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator(z.object({ userId: z.string().min(1).max(80), amount: z.number().int().min(1).max(500) }))
  .handler(async ({ context, data }) => {
    await assertWell(context.userId);
    const sql = await getSql();
    await ensureWell(sql);
    await sql`insert into flint_ledger (amount, reason, user_id) values (${-data.amount}, ${"clawback"}, ${data.userId})`;
    return { ok: true as const };
  });

export const blockTag = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator(z.object({ tag: z.string().min(1).max(24) }))
  .handler(async ({ context, data }) => {
    await assertWell(context.userId);
    const sql = await getSql();
    await sql.query(`create table if not exists tag_blocks (tag text primary key)`);
    await sql.query(`
      create table if not exists listing_tags (
        listing_id text not null,
        tag text not null,
        primary key (listing_id, tag)
      )
    `);
    await sql`insert into tag_blocks (tag) values (${data.tag}) on conflict do nothing`;
    await sql`delete from listing_tags where lower(tag) = lower(${data.tag})`;
    return { ok: true as const };
  });

export const wellBoard = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .handler(async ({ context }) => {
    await assertWell(context.userId);
    const sql = await getSql();
    await ensureWell(sql);
    const expired = await sql<{ listing_id: string }>`
      select listing_id from well_mod where hold_until is not null and hold_until < now()
    `;
    for (const row of expired) {
      await sql`update listings set status = 'removed' where id = ${row.listing_id}`;
      await sql`update well_mod set hidden = true, dead = true, hold_until = null, updated_at = now() where listing_id = ${row.listing_id}`;
      await sql`delete from link_reports where listing_id = ${row.listing_id}`;
    }
    const listingRows = await sql<{ id: string; name: string; tagline: string; url: string; developer_name: string; status: string; platform: string; genres: string; created_at: string }>`
      select id, name, tagline, url, developer_name, coalesce(status, 'live') as status, platform, genres, created_at::text
      from listings order by created_at desc
    `;
    const names = new Map<string, string>([
      ...SEED.map((a) => [a.id, a.name] as const),
      ...listingRows.map((r) => [r.id, r.name] as const),
    ]);
    const reports = await sql<{ listing_id: string; n: number; last: string }>`
      select listing_id, count(*)::int as n, max(created_at)::text as last
      from link_reports group by listing_id order by n desc, last desc limit 80
    `;
    const reviews = await sql<{ id: number; listing_id: string; rating: number; body: string; created_at: string }>`
      select id, listing_id, rating, body, created_at::text from reviews order by created_at desc limit 80
    `;
    const mods = await sql<{ listing_id: string; hidden: boolean; dead: boolean; hold_until: string | null }>`
      select listing_id, hidden, dead, hold_until::text from well_mod
    `;
    const reviewN = await sql<{ n: number }>`select count(*)::int as n from reviews`;
    const reportN = await sql<{ n: number }>`select count(*)::int as n from link_reports`;
    const ratingRows = await sql<{ rating: number; n: number }>`
      select rating, count(*)::int as n from reviews group by rating
    `;
    const reportDays = await sql<{ day: string; n: number }>`
      select to_char(created_at::date, 'YYYY-MM-DD') as day, count(*)::int as n
      from link_reports
      where created_at > now() - interval '14 days'
      group by 1
      order by 1
    `;
    let opens: { listing_id: string; n: number }[] = [];
    try {
      opens = await sql<{ listing_id: string; n: number }>`
        select listing_id, count(*)::int as n
        from yard_events
        where kind = 'open'
        group by listing_id
        order by n desc
        limit 12
      `;
    } catch {
      opens = [];
    }
    let beta = 0;
    let claims = 0;
    try {
      const b = await sql<{ n: number }>`select count(*)::int as n from beta_testers`;
      beta = b[0]?.n ?? 0;
    } catch {
      beta = 0;
    }
    try {
      const c = await sql<{ n: number }>`select count(*)::int as n from claim_requests`;
      claims = c[0]?.n ?? 0;
    } catch {
      claims = 0;
    }
    let flintsIssued = 0;
    let suggestionRows: { id: number; kind: string; body: string; email: string | null; created_at: string }[] = [];
    let sponsorRows: { listing_id: string; kind: string; days: number; ends: string }[] = [];
    try {
      const f = await sql<{ n: number }>`select coalesce(sum(amount), 0)::int as n from flint_ledger`;
      flintsIssued = f[0]?.n ?? 0;
    } catch {
      flintsIssued = 0;
    }
    try {
      suggestionRows = await sql<{ id: number; kind: string; body: string; email: string | null; created_at: string }>`
        select id, kind, body, email, created_at::text from suggestions order by created_at desc limit 40
      `;
    } catch {
      suggestionRows = [];
    }
    try {
      sponsorRows = await sql<{ listing_id: string; kind: string; days: number; ends: string }>`
        select listing_id, kind, days, ends::text from sponsor_runs where ends > now()
      `;
    } catch {
      sponsorRows = [];
    }
    const pending = listingRows.filter((r) => r.status === "pending");
    const hidden = new Set(mods.filter((m) => m.hidden).map((m) => m.listing_id));
    const dead = new Set(mods.filter((m) => m.dead).map((m) => m.listing_id));
    const liveListings = listingRows.filter((r) => r.status === "live" && !hidden.has(r.id));
    const catalog = [
      ...SEED.filter((a) => !hidden.has(a.id)),
      ...liveListings.map((r) => ({
        id: r.id,
        platform: r.platform,
        developer: r.developer_name,
        genres: r.genres,
        provenance: inferProvenance({ platform: r.platform, developer: r.developer_name }),
      })),
    ];
    const vibe = catalog.filter((a) => inferProvenance(a) === "vibe").length;
    const platforms = new Map<string, number>();
    const genres = new Map<string, number>();
    for (const a of catalog) {
      platforms.set(a.platform || "Unknown", (platforms.get(a.platform || "Unknown") || 0) + 1);
      const raw = a.genres;
      const parts = Array.isArray(raw) ? raw : String(raw || "").split(",");
      for (const piece of parts.filter(Boolean)) {
        genres.set(piece, (genres.get(piece) || 0) + 1);
      }
    }
    const stars = [1, 2, 3, 4, 5].map((s) => ({
      star: s,
      n: ratingRows.find((r) => r.rating === s)?.n ?? 0,
    }));
    const reportById = new Map(reports.map((r) => [r.listing_id, r.n]));
    let rareTags: { tag: string; n: number }[] = [];
    let roster: { userId: string; n: number }[] = [];
    try {
      rareTags = await sql<{ tag: string; n: number }>`
        select tag, count(*)::int as n from listing_tags group by tag order by n asc, tag asc limit 24
      `;
    } catch {
      rareTags = [];
    }
    try {
      roster = await sql<{ userId: string; n: number }>`
        select user_id as "userId", coalesce(sum(amount), 0)::int as n
        from flint_ledger where user_id is not null
        group by user_id order by n desc limit 40
      `;
    } catch {
      roster = [];
    }
    return {
      pulse: {
        apps: catalog.length,
        vibe,
        all: catalog.length,
        reviews: reviewN[0]?.n ?? 0,
        reports: reportN[0]?.n ?? 0,
        pending: pending.length,
        beta,
        claims,
        dead: mods.filter((m) => m.dead && !m.hidden).length,
        hidden: mods.filter((m) => m.hidden && !m.dead).length,
        flintsIssued,
        sponsorsPaid: SEED.filter((a) => a.sponsored && !hidden.has(a.id)).length + sponsorRows.filter((s) => s.kind === "paid").length,
        sponsorsFlint: sponsorRows.filter((s) => s.kind === "flint").length,
        sponsors7: sponsorRows.filter((s) => s.days === 7).length,
        sponsors30: sponsorRows.filter((s) => s.days === 30).length + SEED.filter((a) => a.sponsored && !hidden.has(a.id)).length,
        suggestions: suggestionRows.length,
      },
      reports: reports
        .filter((r) => !dead.has(r.listing_id) && !hidden.has(r.listing_id))
        .map((r) => ({
          listingId: r.listing_id,
          name: labelOf(r.listing_id, names),
          n: r.n,
          last: r.last,
        })),
      dead: mods
        .filter((m) => m.dead && !m.hidden)
        .map((m) => ({
          listingId: m.listing_id,
          name: labelOf(m.listing_id, names),
          n: reportById.get(m.listing_id) ?? 0,
        })),
      hidden: mods
        .filter((m) => m.hidden && !m.dead && !m.hold_until)
        .map((m) => ({
          listingId: m.listing_id,
          name: labelOf(m.listing_id, names),
        })),
      holds: mods
        .filter((m) => m.hold_until && !m.dead)
        .map((m) => ({
          listingId: m.listing_id,
          name: labelOf(m.listing_id, names),
          until: m.hold_until,
        })),
      reviews: reviews.map((r) => ({
        id: r.id,
        listingId: r.listing_id,
        name: labelOf(r.listing_id, names),
        rating: r.rating,
        body: r.body,
        createdAt: r.created_at,
      })),
      pending: pending.map((r) => ({
        id: r.id,
        name: r.name,
        tagline: r.tagline,
        url: r.url,
        developer: r.developer_name,
      })),
      mods: mods.map((m) => ({ listingId: m.listing_id, hidden: m.hidden, dead: m.dead })),
      suggestions: suggestionRows.map((s) => ({
        id: s.id,
        kind: s.kind,
        body: s.body,
        email: s.email,
        createdAt: s.created_at,
      })),
      sponsors: sponsorRows.map((s) => ({
        listingId: s.listing_id,
        name: labelOf(s.listing_id, names),
        kind: s.kind,
        days: s.days,
        ends: s.ends,
      })),
      analytics: {
        stars,
        platforms: [...platforms.entries()]
          .map(([name, n]) => ({ name, n }))
          .sort((a, b) => b.n - a.n)
          .slice(0, 8),
        genres: [...genres.entries()]
          .map(([id, n]) => ({ id, label: GENRE_META[id as keyof typeof GENRE_META]?.label || id, n }))
          .sort((a, b) => b.n - a.n)
          .slice(0, 8),
        reportDays,
        opens: opens.map((o) => ({
          listingId: o.listing_id,
          name: labelOf(o.listing_id, names),
          n: o.n,
        })),
      },
      rareTags,
      roster,
    };
  });

export const wellAct = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator(
    z.object({
      listingId: z.string().min(1).max(80),
      action: z.enum(["shelf", "hide", "dead", "restore", "purge", "dismiss", "hold"]),
    }),
  )
  .handler(async ({ context, data }) => {
    await assertWell(context.userId);
    const sql = await getSql();
    await ensureWell(sql);
    const id = data.listingId;
    if (data.action === "dismiss") {
      await sql`delete from link_reports where listing_id = ${id}`;
      return { ok: true as const };
    }
    if (data.action === "hold") {
      const until = new Date(Date.now() + 30 * 86400000).toISOString();
      await sql`update listings set status = 'hidden' where id = ${id}`;
      await sql`
        insert into well_mod (listing_id, hidden, dead, updated_at, hold_until)
        values (${id}, true, false, now(), ${until}::timestamptz)
        on conflict (listing_id) do update set hidden = true, dead = false, hold_until = ${until}::timestamptz, updated_at = now()
      `;
      await sql`delete from link_reports where listing_id = ${id}`;
      return { ok: true as const };
    }
    if (data.action === "purge") {
      await sql`update listings set status = 'removed' where id = ${id}`;
      await sql`
        insert into well_mod (listing_id, hidden, dead, updated_at)
        values (${id}, true, true, now())
        on conflict (listing_id) do update set hidden = true, dead = true, updated_at = now()
      `;
      await sql`delete from link_reports where listing_id = ${id}`;
      return { ok: true as const };
    }
    const hidden = data.action === "hide";
    const dead = data.action === "dead";
    if (data.action === "shelf" || data.action === "restore") {
      await sql`update listings set status = 'live' where id = ${id}`;
      await sql`
        insert into well_mod (listing_id, hidden, dead, updated_at)
        values (${id}, false, false, now())
        on conflict (listing_id) do update set hidden = false, dead = false, hold_until = null, updated_at = now()
      `;
    } else {
      await sql`update listings set status = ${hidden ? "hidden" : "live"} where id = ${id}`;
      await sql`
        insert into well_mod (listing_id, hidden, dead, updated_at)
        values (${id}, ${hidden}, ${dead}, now())
        on conflict (listing_id) do update set hidden = ${hidden}, dead = ${dead}, updated_at = now()
      `;
      if (dead) await sql`delete from link_reports where listing_id = ${id}`;
    }
    return { ok: true as const };
  });
