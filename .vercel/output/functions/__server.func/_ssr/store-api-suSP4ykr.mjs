import { r as SEED } from "./catalog-TG5V1spf.mjs";
import { i as TSS_SERVER_FUNCTION, r as createServerFn } from "./ssr.mjs";
import { i as getSql, t as authMiddleware } from "./middleware-XvMU1Pa0.mjs";
import { hn as object, ln as array, mn as number, un as boolean, vn as string } from "../_libs/@better-auth/core+[...].mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/store-api-suSP4ykr.js
var createServerRpc = (serverFnMeta, splitImportFn) => {
	const url = "/_serverFn/" + serverFnMeta.id;
	return Object.assign(splitImportFn, {
		url,
		serverFnMeta,
		[TSS_SERVER_FUNCTION]: true
	});
};
function useLiveDb() {
	return Boolean(process.env.DATABASE_URL) || false;
}
function rowToApp(row, rating = 0, n = 0) {
	return {
		id: row.id,
		name: row.name,
		tagline: row.tagline,
		description: row.description || row.tagline,
		url: row.url,
		developer: row.developer_name,
		genres: row.genres.split(",").filter(Boolean),
		paid: row.paid,
		comingSoon: row.coming_soon,
		ownerId: row.user_id,
		source: "Developer",
		rating,
		ratingsCount: n,
		featured: false
	};
}
var listStore_createServerFn_handler = createServerRpc({
	id: "e9ca7ff80d5ee2d93c2edda501ce3f3e4cabd5e07c03581e07e0af9d102460b8",
	name: "listStore",
	filename: "src/lib/store-api.ts"
}, (opts) => listStore.__executeServer(opts));
var listStore = createServerFn({ method: "GET" }).handler(listStore_createServerFn_handler, async () => {
	if (!useLiveDb()) return SEED;
	try {
		const sql = await getSql();
		const rows = await sql`
      select id, user_id, name, tagline, description, url, developer_name, genres, paid, coming_soon
      from listings order by created_at desc
    `;
		const aggs = await sql`
      select listing_id, avg(rating)::float as avg, count(*)::int as n
      from reviews group by listing_id
    `;
		const aggMap = new Map(aggs.map((a) => [a.listing_id, a]));
		const uploaded = rows.map((r) => {
			const a = aggMap.get(r.id);
			return rowToApp(r, a?.avg ?? 0, a?.n ?? 0);
		});
		const map = /* @__PURE__ */ new Map();
		[...SEED, ...uploaded].forEach((x) => map.set(x.id, x));
		return Array.from(map.values());
	} catch {
		return SEED;
	}
});
var listReviews_createServerFn_handler = createServerRpc({
	id: "5a7c6dd3ab500159dfc3ac8e7a0ad43e95b0508a8999ff1ba1c8e6545652dfeb",
	name: "listReviews",
	filename: "src/lib/store-api.ts"
}, (opts) => listReviews.__executeServer(opts));
var listReviews = createServerFn({ method: "GET" }).validator(object({ listingId: string() })).handler(listReviews_createServerFn_handler, async ({ data }) => {
	if (!useLiveDb()) return [];
	try {
		return (await getSql())`
        select id, rating, body, created_at from reviews
        where listing_id = ${data.listingId}
        order by created_at desc limit 40
      `;
	} catch {
		return [];
	}
});
var submitSchema = object({
	name: string().min(1).max(80),
	tagline: string().min(1).max(160),
	description: string().max(2e3).optional().default(""),
	url: string().max(400).optional().default("#"),
	developerName: string().min(1).max(80),
	genres: array(string()).min(1),
	paid: boolean().optional().default(false),
	comingSoon: boolean().optional().default(false)
});
var submitListing_createServerFn_handler = createServerRpc({
	id: "0d0d4dc573e366c073e9bb54ed024b1904df222308ad6469f0ad9735ff8db16c",
	name: "submitListing",
	filename: "src/lib/store-api.ts"
}, (opts) => submitListing.__executeServer(opts));
var submitListing = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator(submitSchema).handler(submitListing_createServerFn_handler, async ({ data, context }) => {
	const sql = await getSql();
	const id = `dev-${context.userId.slice(0, 8)}-${Date.now()}`;
	const url = data.url?.trim() || "#";
	await sql`
      insert into listings (id, user_id, name, tagline, description, url, developer_name, genres, paid, coming_soon)
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
        ${data.comingSoon ?? false}
      )
    `;
	return { id };
});
var rateListing_createServerFn_handler = createServerRpc({
	id: "a8f51cfbd5ae9b25ed43731fd3d2f52300562e61f86d9dbae81cd3667737a35f",
	name: "rateListing",
	filename: "src/lib/store-api.ts"
}, (opts) => rateListing.__executeServer(opts));
var rateListing = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator(object({
	listingId: string(),
	rating: number().int().min(1).max(5),
	body: string().max(600).optional().default("")
})).handler(rateListing_createServerFn_handler, async ({ data, context }) => {
	await (await getSql())`
      insert into reviews (user_id, listing_id, rating, body)
      values (${context.userId}, ${data.listingId}, ${data.rating}, ${data.body ?? ""})
      on conflict (user_id, listing_id)
      do update set rating = excluded.rating, body = excluded.body
    `;
	return { ok: true };
});
var myListings_createServerFn_handler = createServerRpc({
	id: "22817ea21b8c103f4d97aeece8757b12033b2b91bfa8c8fd0174d2fdd3a8d513",
	name: "myListings",
	filename: "src/lib/store-api.ts"
}, (opts) => myListings.__executeServer(opts));
var myListings = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(myListings_createServerFn_handler, async ({ context }) => {
	return (await (await getSql())`
      select id, user_id, name, tagline, description, url, developer_name, genres, paid, coming_soon
      from listings where user_id = ${context.userId} order by created_at desc
    `).map((r) => rowToApp(r));
});
//#endregion
export { listReviews_createServerFn_handler, listStore_createServerFn_handler, myListings_createServerFn_handler, rateListing_createServerFn_handler, submitListing_createServerFn_handler };
