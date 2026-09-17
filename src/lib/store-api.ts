import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { authMiddleware } from "@/lib/auth/middleware";
import { getSql } from "@/lib/db";
import { SEED, type AppEntry, type Genre } from "@/lib/catalog";
import { inferProvenance, inferRoles } from "@/lib/provenance";

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
  if (!useLiveDb()) return SEED;
  try {
    const sql = await getSql();
    const rows = await sql<ListingRow>`
      select id, user_id, name, tagline, description, url, developer_name, genres, paid, coming_soon, platform
      from listings order by created_at desc
    `;
    const aggs = await sql<ReviewAgg>`
      select listing_id, avg(rating)::float as avg, count(*)::int as n
      from reviews group by listing_id
    `;
    const aggMap = new Map(aggs.map((a) => [a.listing_id, a]));
    const uploaded = rows.map((r) => {
      const a = aggMap.get(r.id);
      return rowToApp(r, a?.avg ?? 0, a?.n ?? 0);
    });
    const map = new Map<string, AppEntry>();
    [...SEED, ...uploaded].forEach((x) => map.set(x.id, x));
    return Array.from(map.values());
  } catch {
    return SEED;
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
});

export const submitListing = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator(submitSchema)
  .handler(async ({ data, context }) => {
    const sql = await getSql();
    const id = `dev-${context.userId.slice(0, 8)}-${Date.now()}`;
    const url = data.url?.trim() || "#";
    await sql`
      insert into listings (id, user_id, name, tagline, description, url, developer_name, genres, paid, coming_soon, platform, icon_url, contact_email, screenshots, installable, offline)
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
        ${data.offline ?? false}
      )
    `;
    return { id };
  });

export const rateListing = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator(
    z.object({
      listingId: z.string(),
      rating: z.number().int().min(1).max(5),
      body: z.string().max(600).optional().default(""),
    }),
  )
  .handler(async ({ data, context }) => {
    const sql = await getSql();
    await sql`
      insert into reviews (user_id, listing_id, rating, body)
      values (${context.userId}, ${data.listingId}, ${data.rating}, ${data.body ?? ""})
      on conflict (user_id, listing_id)
      do update set rating = excluded.rating, body = excluded.body
    `;
    return { ok: true };
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


