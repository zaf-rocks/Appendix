import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { authMiddleware } from "@/lib/auth/middleware";
import { getSql } from "@/lib/db";
import { SEED, type AppEntry, type Genre } from "@/lib/catalog";
import { inferProvenance, inferRoles } from "@/lib/provenance";
import { baseTags, cleanTag, mergeTags, TAG_CAP } from "@/lib/tags";

type ListingRow = {
  id: string;
  user_id: string;
  name: string;
  tagline: string;
  description: string;
  url: string;
  developer_name: string;
  genres: string;
  paid: boolean;
  coming_soon: boolean;
  platform: string;
  status?: string;
};

type ReviewAgg = { listing_id: string; avg: number; n: number };

function faviconFor(url?: string) {
  if (!url || !url.startsWith("http")) return undefined;
  try {
    return `https://www.google.com/s2/favicons?sz=128&domain=${new URL(url).hostname.replace(/^www\./, "")}`;
  } catch {
    return undefined;
  }
}

function useLiveDb() {
  return Boolean(process.env.DATABASE_URL) || process.env.NODE_ENV !== "production";
}

function rowToApp(row: ListingRow, rating = 0, n = 0): AppEntry {
  return {
    id: row.id,
    name: row.name,
    tagline: row.tagline,
    description: row.description || row.tagline,
    url: row.url,
    developer: row.developer_name,
    genres: row.genres.split(",").filter(Boolean) as Genre[],
    paid: row.paid,
    comingSoon: row.coming_soon,
    ownerId: row.user_id,
    platform: row.platform || "Unknown",
    iconUrl: faviconFor(row.url),
    rating,
    ratingsCount: n,
    featured: false,
    provenance: inferProvenance({ platform: row.platform, developer: row.developer_name }),
    roles: inferRoles({ genres: row.genres.split(","), name: row.name, developer: row.developer_name }),
  };
}

export const listStore = createServerFn({ method: "GET" }).handler(async () => {
  if (!useLiveDb()) return SEED.map((app) => ({ ...app, tags: baseTags(app) }));
  try {
    const sql = await getSql();
    const rows = await sql<ListingRow>`
      select id, user_id, name, tagline, description, url, developer_name, genres, paid, coming_soon, platform, coalesce(status, 'live') as status
      from listings order by created_at desc
    `;
    const aggs = await sql<ReviewAgg>`
      select listing_id, avg(rating)::float as avg, count(*)::int as n
      from reviews group by listing_id
    `;
    let hidden = new Set<string>();
    let dead = new Set<string>();
    try {
      const mods = await sql<{ listing_id: string; hidden: boolean; dead: boolean }>`
        select listing_id, hidden, dead from well_mod
      `;
      hidden = new Set(mods.filter((m) => m.hidden).map((m) => m.listing_id));
      dead = new Set(mods.filter((m) => m.dead).map((m) => m.listing_id));
    } catch {
      hidden = new Set();
    }
    const aggMap = new Map(aggs.map((a) => [a.listing_id, a]));
    const uploaded = rows
      .filter((r) => (r.status || "live") === "live" && !hidden.has(r.id))
      .map((r) => {
        const a = aggMap.get(r.id);
        const app = rowToApp(r, a?.avg ?? 0, a?.n ?? 0);
        if (dead.has(r.id)) app.url = "#";
        return app;
      });
    const map = new Map<string, AppEntry>();
    SEED.filter((a) => !hidden.has(a.id)).forEach((a) => {
      map.set(a.id, dead.has(a.id) ? { ...a, url: "#" } : a);
    });
    uploaded.forEach((x) => map.set(x.id, x));
    const apps = Array.from(map.values());
    try {
      await sql.query(`
        create table if not exists listing_tags (
          listing_id text not null,
          tag text not null,
          primary key (listing_id, tag)
        )
      `);
      await sql.query(`create table if not exists tag_blocks (tag text primary key)`);
      const blockedRows = await sql<{ tag: string }>`select tag from tag_blocks`;
      const extraRows = await sql<{ listing_id: string; tag: string }>`select listing_id, tag from listing_tags`;
      const blocked = new Set(blockedRows.map((r) => r.tag.toLowerCase()));
      const extras = new Map<string, string[]>();
      for (const row of extraRows) {
        const list = extras.get(row.listing_id) || [];
        list.push(row.tag);
        extras.set(row.listing_id, list);
      }
      return apps.map((app) => ({
        ...app,
        tags: mergeTags(baseTags(app), extras.get(app.id) || [], blocked),
      }));
    } catch {
      return apps.map((app) => ({ ...app, tags: baseTags(app) }));
    }
  } catch {
    return SEED.map((app) => ({ ...app, tags: baseTags(app) }));
  }
});

export const listReviews = createServerFn({ method: "GET" })
  .validator(z.object({ listingId: z.string() }))
  .handler(async ({ data }) => {
    if (!useLiveDb()) return [];
    try {
      const sql = await getSql();
      return sql<{ id: number; rating: number; body: string; created_at: string }>`
        select id, rating, body, created_at from reviews
        where listing_id = ${data.listingId}
        order by created_at desc limit 40
      `;
    } catch {
      return [];
    }
  });

const submitSchema = z.object({
  name: z.string().min(1).max(80),
  tagline: z.string().min(1).max(160),
  description: z.string().max(2000).optional().default(""),
  url: z.string().max(400).optional().default("#"),
  developerName: z.string().min(1).max(80),
  genres: z.array(z.string()).min(1),
  paid: z.boolean().optional().default(false),
  comingSoon: z.boolean().optional().default(false),
  platform: z.string().max(40).optional().default("Unknown"),
  iconUrl: z.string().max(120000).optional().default(""),
  contactEmail: z.string().max(120).optional().default(""),
  screenshots: z.string().max(800).optional().default(""),
  installable: z.boolean().optional().default(false),
  offline: z.boolean().optional().default(false),
  tags: z.string().max(240).optional().default(""),
});

export const submitListing = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator(submitSchema)
  .handler(async ({ data, context }) => {
    const sql = await getSql();
    const id = `dev-${context.userId.slice(0, 8)}-${Date.now()}`;
    const url = data.url?.trim() || "#";
    const norm = url.replace(/\/+$/, "").toLowerCase();
    if (norm && norm !== "#") {
      const seedHit = SEED.some((a) => (a.url || "").replace(/\/+$/, "").toLowerCase() === norm);
      const rows = await sql<{ id: string }>`
        select id from listings
        where lower(rtrim(url, '/')) = ${norm}
          and coalesce(status, 'live') <> 'removed'
        limit 1
      `;
      if (seedHit || rows.length) return { id: "", duplicate: true as const };
    }
    await sql`
      insert into listings (id, user_id, name, tagline, description, url, developer_name, genres, paid, coming_soon, platform, icon_url, contact_email, screenshots, installable, offline, status)
      values (
        ${id},
        ${context.userId},
        ${data.name.trim()},
        ${data.tagline.trim()},
        ${data.description ?? ""},
        ${url},
        ${data.developerName.trim()},
        ${data.genres.join(",")},
        ${data.paid ?? false},
        ${data.comingSoon ?? false},
        ${data.platform ?? "Unknown"},
        ${data.iconUrl ?? ""},
        ${data.contactEmail ?? ""},
        ${data.screenshots ?? ""},
        ${data.installable ?? false},
        ${data.offline ?? false},
        'pending'
      )
    `;
    return { id, duplicate: false as const };
  });

export const myBookmarks = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .handler(async ({ context }) => {
    const sql = await getSql();
    await sql.query(`
      create table if not exists user_bookmarks (
        user_id text not null,
        listing_id text not null,
        primary key (user_id, listing_id)
      )
    `);
    const rows = await sql<{ listing_id: string }>`select listing_id from user_bookmarks where user_id = ${context.userId}`;
    return rows.map((r) => r.listing_id);
  });

export const setBookmark = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator(z.object({ listingId: z.string().min(1).max(80), on: z.boolean() }))
  .handler(async ({ data, context }) => {
    const sql = await getSql();
    await sql.query(`
      create table if not exists user_bookmarks (
        user_id text not null,
        listing_id text not null,
        primary key (user_id, listing_id)
      )
    `);
    if (data.on) {
      await sql`
        insert into user_bookmarks (user_id, listing_id) values (${context.userId}, ${data.listingId})
        on conflict do nothing
      `;
    } else {
      await sql`delete from user_bookmarks where user_id = ${context.userId} and listing_id = ${data.listingId}`;
    }
    return { ok: true as const };
  });

export const addListingTags = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator(z.object({ listingId: z.string().min(1).max(80), tags: z.array(z.string()).min(1).max(10) }))
  .handler(async ({ data, context }) => {
    const sql = await getSql();
    await sql.query(`
      create table if not exists listing_tags (
        listing_id text not null,
        tag text not null,
        primary key (listing_id, tag)
      )
    `);
    await sql.query(`create table if not exists tag_blocks (tag text primary key)`);
    const blocked = new Set((await sql<{ tag: string }>`select tag from tag_blocks`).map((r) => r.tag.toLowerCase()));
    const have = await sql<{ tag: string }>`select tag from listing_tags where listing_id = ${data.listingId}`;
    const owned = new Set(have.map((r) => r.tag.toLowerCase()));
    let added = 0;
    for (const raw of data.tags) {
      const tag = cleanTag(raw);
      if (!tag || blocked.has(tag.toLowerCase()) || owned.has(tag.toLowerCase())) continue;
      if (owned.size >= TAG_CAP) break;
      await sql`insert into listing_tags (listing_id, tag) values (${data.listingId}, ${tag}) on conflict do nothing`;
      owned.add(tag.toLowerCase());
      added += 1;
    }
    const flints = Math.floor(added / 3);
    if (flints > 0) {
      try {
        await sql.query(`alter table flint_ledger add column if not exists user_id text`);
        await sql`insert into flint_ledger (amount, reason, user_id) values (${flints}, ${`tags:${data.listingId}:${Date.now()}`}, ${context.userId})`;
      } catch {
        /* ledger may not exist yet */
      }
    }
    return { ok: true as const, added, flints };
  });

export const rateListing = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator(
    z.object({
      listingId: z.string(),
      rating: z.number().int().min(1).max(5),
      body: z.string().max(600).optional().default(""),
      privateBody: z.string().max(800).optional().default(""),
    }),
  )
  .handler(async ({ data, context }) => {
    const sql = await getSql();
    await sql.query(`alter table reviews add column if not exists private_body text`);
    const existing = await sql<{ id: number }>`
      select id from reviews where user_id = ${context.userId} and listing_id = ${data.listingId} limit 1
    `;
    if (existing.length) return { ok: false as const, already: true as const };
    await sql`
      insert into reviews (user_id, listing_id, rating, body, private_body)
      values (${context.userId}, ${data.listingId}, ${data.rating}, ${data.body ?? ""}, ${data.privateBody ?? ""})
    `;
    return { ok: true as const, already: false as const };
  });

export const myListings = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .handler(async ({ context }) => {
    const sql = await getSql();
    const rows = await sql<ListingRow>`
      select id, user_id, name, tagline, description, url, developer_name, genres, paid, coming_soon, platform
      from listings where user_id = ${context.userId} order by created_at desc
    `;
    return rows.map((r) => rowToApp(r));
  });

export const joinBeta = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator(z.object({ note: z.string().max(400).optional().default("") }))
  .handler(async ({ data, context }) => {
    const sql = await getSql();
    await sql`
      insert into beta_testers (user_id, note)
      values (${context.userId}, ${data.note ?? ""})
      on conflict (user_id) do update set note = excluded.note
    `;
    return { ok: true };
  });

export const betaCount = createServerFn({ method: "GET" }).handler(async () => {
  if (!useLiveDb()) return { n: 12 };
  try {
    const sql = await getSql();
    const rows = await sql<{ n: number }>`select count(*)::int as n from beta_testers`;
    return { n: rows[0]?.n ?? 0 };
  } catch {
    return { n: 0 };
  }
});

export const requestClaim = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator(
    z.object({
      listingId: z.string(),
      email: z.string().email(),
      proof: z.string().min(8).max(800),
    }),
  )
  .handler(async ({ data, context }) => {
    const sql = await getSql();
    await sql`
      insert into claim_requests (listing_id, user_id, email, proof)
      values (${data.listingId}, ${context.userId}, ${data.email}, ${data.proof})
    `;
    return { ok: true };
  });

export const listClaims = createServerFn({ method: "GET" }).handler(async () => {
  if (!useLiveDb()) return [] as { listing_id: string; user_id: string }[];
  try {
    const sql = await getSql();
    return sql<{ listing_id: string; user_id: string }>`select listing_id, user_id from claims`;
  } catch {
    return [];
  }
});


