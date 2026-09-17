import { o as __toESM } from "../_runtime.mjs";
import { a as isLive, i as TONE_BG, n as GENRE_META, t as GENRES } from "./catalog-TG5V1spf.mjs";
import { B as require_react, _ as Link, b as require_jsx_runtime } from "../_libs/@tanstack/react-router+[...].mjs";
import { i as Search, r as Star } from "../_libs/lucide-react.mjs";
import { r as Route$4 } from "./router-CTDSTTJe.mjs";
import { i as cn, r as StoreShell, t as AppIcon } from "./store-shell-C9LZfUQl.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/routes-DH1D9twN.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function Home() {
	const catalog = Route$4.useLoaderData();
	const [query, setQuery] = (0, import_react.useState)("");
	const [genre, setGenre] = (0, import_react.useState)("all");
	const filtered = (0, import_react.useMemo)(() => {
		const q = query.trim().toLowerCase();
		return catalog.filter((a) => {
			if (genre !== "all" && !a.genres.includes(genre)) return false;
			if (!q) return true;
			return a.name.toLowerCase().includes(q) || a.developer.toLowerCase().includes(q) || a.tagline.toLowerCase().includes(q);
		}).sort((a, b) => b.rating - a.rating || b.ratingsCount - a.ratingsCount);
	}, [
		catalog,
		genre,
		query
	]);
	const featured = catalog.filter((a) => a.featured);
	const editors = catalog.filter((a) => a.editorsPick);
	const charts = [...catalog].sort((a, b) => b.ratingsCount - a.ratingsCount).slice(0, 8);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(StoreShell, { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
			className: "relative block",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, { className: "pointer-events-none absolute top-1/2 left-4 size-4 -translate-y-1/2 text-muted" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
				value: query,
				onChange: (e) => setQuery(e.target.value),
				placeholder: "Search apps & games",
				className: "h-12 w-full rounded-full border border-border bg-surface pr-4 pl-11 outline-none placeholder:text-subtle focus:border-primary"
			})]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "-mx-4 mt-4 flex gap-2 overflow-x-auto px-4 pb-1",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Chip, {
				active: genre === "all",
				onClick: () => setGenre("all"),
				children: "For you"
			}), GENRES.map((g) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Chip, {
				active: genre === g,
				tone: GENRE_META[g].tone,
				onClick: () => setGenre(g),
				children: GENRE_META[g].label
			}, g))]
		}),
		genre === "all" && !query ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Rail, {
				title: "Featured",
				apps: featured
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Rail, {
				title: "Editors' picks",
				apps: editors
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
				className: "mt-8 text-sm font-semibold text-muted",
				children: "Top charts"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AppList, { apps: charts })
		] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
			className: "mt-6 text-sm font-semibold text-muted",
			children: genre === "all" ? "Results" : GENRE_META[genre].label
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AppList, { apps: filtered })] })
	] });
}
function Rail({ title, apps }) {
	if (!apps.length) return null;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mt-7",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
			className: "text-sm font-semibold text-muted",
			children: title
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "-mx-4 mt-3 flex gap-3 overflow-x-auto px-4 pb-2",
			children: apps.map((app) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
				to: "/app/$id",
				params: { id: app.id },
				className: "w-[230px] shrink-0 rounded-xl bg-surface p-4 ring-1 ring-border",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AppIcon, {
						name: app.name,
						tone: GENRE_META[app.genres[0]]?.tone || "slate"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-3 truncate font-semibold",
						children: app.name
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "truncate text-sm text-muted",
						children: app.developer
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stars, { app }),
					app.sponsored ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-1 text-[11px] text-subtle",
						children: "Sponsored"
					}) : null
				]
			}, app.id))
		})]
	});
}
function AppList({ apps }) {
	if (!apps.length) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
		className: "mt-10 text-center text-muted",
		children: "Nothing in this aisle yet."
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
		className: "mt-3 divide-y divide-line overflow-hidden rounded-xl bg-surface ring-1 ring-border",
		children: apps.map((app) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
			to: "/app/$id",
			params: { id: app.id },
			className: "flex items-center gap-3 px-3 py-3",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AppIcon, {
					name: app.name,
					tone: GENRE_META[app.genres[0]]?.tone || "slate",
					className: "size-12 rounded-xl text-lg"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "min-w-0 flex-1",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "truncate font-medium",
							children: app.name
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "truncate text-sm text-muted",
							children: [
								app.developer,
								" · ",
								GENRE_META[app.genres[0]]?.label,
								app.paid ? " · Paid" : " · Free"
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stars, { app })
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "grid h-9 min-w-16 place-items-center rounded-full bg-raised px-3 text-sm font-semibold text-get",
					children: isLive(app) ? "Open" : "Soon"
				})
			]
		}) }, app.id))
	});
}
function Stars({ app }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
		className: "mt-0.5 flex items-center gap-1 text-xs text-muted",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Star, { className: "size-3 fill-cat-amber text-cat-amber" }),
			app.rating ? app.rating.toFixed(1) : "—",
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
				className: "text-subtle",
				children: [
					"(",
					app.ratingsCount,
					")"
				]
			})
		]
	});
}
function Chip({ active, onClick, children, tone }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
		type: "button",
		onClick,
		className: cn("inline-flex h-9 shrink-0 items-center gap-2 rounded-full px-3 text-sm font-medium", active ? "bg-fg text-bg" : "bg-surface text-muted ring-1 ring-border"),
		children: [tone ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: cn("size-2 rounded-full", TONE_BG[tone]) }) : null, children]
	});
}
//#endregion
export { Home as component };
