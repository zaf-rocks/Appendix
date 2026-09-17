import { o as __toESM } from "../_runtime.mjs";
import { a as isLive, n as GENRE_META } from "./catalog-TG5V1spf.mjs";
import { B as require_react, _ as Link, b as require_jsx_runtime } from "../_libs/@tanstack/react-router+[...].mjs";
import { o as ArrowUpRight, r as Star } from "../_libs/lucide-react.mjs";
import { a as rateListing, n as Route$1 } from "./router-CTDSTTJe.mjs";
import { a as useCurrentUserState, r as StoreShell, t as AppIcon } from "./store-shell-C9LZfUQl.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/app._id-DLLBYJ2G.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function AppPage() {
	const { app, catalog, reviews } = Route$1.useLoaderData();
	const { user, isPending } = useCurrentUserState();
	const [rating, setRating] = (0, import_react.useState)(5);
	const [body, setBody] = (0, import_react.useState)("");
	const [note, setNote] = (0, import_react.useState)(null);
	if (!app) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(StoreShell, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
		className: "text-muted",
		children: "This listing wandered off the scrapyard."
	}) });
	const similar = catalog.filter((a) => a.id !== app.id && a.genres.some((g) => app.genres.includes(g))).slice(0, 6);
	const more = catalog.filter((a) => a.id !== app.id && a.developer === app.developer);
	const live = isLive(app);
	const tone = GENRE_META[app.genres[0]]?.tone || "slate";
	const current = app;
	async function onRate(e) {
		e.preventDefault();
		try {
			await rateListing({ data: {
				listingId: current.id,
				rating,
				body
			} });
			setNote("Review filed. Witty and on the record.");
			setBody("");
		} catch {
			setNote("Sign in to leave a rating.");
		}
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(StoreShell, { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex gap-4",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AppIcon, {
				name: app.name,
				tone,
				className: "size-20 rounded-3xl text-3xl"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "min-w-0",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
						className: "text-2xl font-semibold",
						children: app.name
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm text-primary",
						children: app.developer
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "mt-1 text-sm text-muted",
						children: [
							app.paid ? "Paid" : "Free",
							" · ",
							GENRE_META[app.genres[0]]?.label,
							app.sponsored ? " · Sponsored" : ""
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "mt-1 flex items-center gap-1 text-sm text-muted",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Star, { className: "size-3.5 fill-cat-amber text-cat-amber" }),
							app.rating.toFixed(1),
							" · ",
							app.ratingsCount,
							" ratings"
						]
					})
				]
			})]
		}),
		live ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
			href: app.url,
			target: "_blank",
			rel: "noreferrer",
			className: "mt-5 flex h-12 items-center justify-center gap-2 rounded-full bg-get font-semibold text-get-fg",
			children: ["Open ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowUpRight, { className: "size-4" })]
		}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "mt-5 rounded-xl bg-raised px-4 py-3 text-sm text-muted",
			children: "Soon. The developer left a flare: this one is not live yet. No fake download button. We do not do that here."
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "mt-6 flex gap-3 overflow-x-auto pb-1",
			children: [
				0,
				1,
				2
			].map((i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "h-44 w-28 shrink-0 overflow-hidden rounded-xl bg-raised p-3 ring-1 ring-border",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: `h-6 w-6 rounded-md ${i === 1 ? "bg-cat-mint" : "bg-cat-sky"}` }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "mt-3 h-2 w-16 rounded bg-border" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "mt-2 h-2 w-12 rounded bg-border" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "mt-6 h-16 rounded-lg bg-surface" })
				]
			}, i))
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
			className: "mt-8 text-sm font-semibold",
			children: "About this app"
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "mt-2 text-muted",
			children: app.description
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
			className: "mt-3 text-sm text-subtle",
			children: [
				"Offered by ",
				app.developer,
				". ",
				app.installable ? "Installable PWA." : "Web app.",
				" ",
				app.offline ? "Works offline." : "",
				" ",
				app.aiBuilt ? "AI-assisted build." : ""
			]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
			className: "mt-8 text-sm font-semibold",
			children: "Ratings and reviews"
		}),
		reviews.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "mt-2 text-sm text-muted",
			children: "No civilian reviews yet. Be the first honest one."
		}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
			className: "mt-3 space-y-3",
			children: reviews.map((r) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
				className: "rounded-xl bg-surface p-3 ring-1 ring-border",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "text-sm font-medium",
					children: [r.rating, " / 5"]
				}), r.body ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-1 text-sm text-muted",
					children: r.body
				}) : null]
			}, r.id))
		}),
		!isPending && user ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
			onSubmit: onRate,
			className: "mt-4 space-y-2 rounded-xl bg-surface p-4 ring-1 ring-border",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-sm font-medium",
					children: "Your rating"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "flex gap-1",
					children: [
						1,
						2,
						3,
						4,
						5
					].map((n) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						onClick: () => setRating(n),
						className: "grid size-10 place-items-center",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Star, { className: n <= rating ? "size-5 fill-cat-amber text-cat-amber" : "size-5 text-subtle" })
					}, n))
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
					value: body,
					onChange: (e) => setBody(e.target.value),
					placeholder: "Optional note — keep it sharp",
					className: "h-20 w-full rounded-lg border border-border bg-bg p-3 text-sm outline-none"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "submit",
					className: "h-10 rounded-full bg-primary px-4 text-sm font-semibold text-primary-fg",
					children: "Submit review"
				}),
				note ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-sm text-muted",
					children: note
				}) : null
			]
		}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
			className: "mt-3 text-sm text-muted",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
					to: "/login",
					className: "text-primary",
					children: "Sign in"
				}),
				" ",
				"to rate. Browsing stays free."
			]
		}),
		more.length > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(MiniRail, {
			title: `More by ${app.developer}`,
			apps: more
		}) : null,
		similar.length > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(MiniRail, {
			title: "Similar apps",
			apps: similar
		}) : null
	] });
}
function MiniRail({ title, apps }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mt-8",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
			className: "text-sm font-semibold text-muted",
			children: title
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "mt-3 flex gap-3 overflow-x-auto pb-1",
			children: apps.map((a) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
				to: "/app/$id",
				params: { id: a.id },
				className: "w-28 shrink-0",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AppIcon, {
					name: a.name,
					tone: GENRE_META[a.genres[0]]?.tone || "slate",
					className: "size-16 rounded-2xl"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-2 truncate text-sm",
					children: a.name
				})]
			}, a.id))
		})]
	});
}
//#endregion
export { AppPage as component };
