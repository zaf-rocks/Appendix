import { o as __toESM } from "../_runtime.mjs";
import { n as GENRE_META, t as GENRES } from "./catalog-TG5V1spf.mjs";
import { B as require_react, _ as Link, b as require_jsx_runtime } from "../_libs/@tanstack/react-router+[...].mjs";
import { i as myListings, o as submitListing } from "./router-CTDSTTJe.mjs";
import { a as useCurrentUserState, i as cn, n as RedirectToSignIn, r as StoreShell } from "./store-shell-C9LZfUQl.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/studio-BOmWWtHi.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function Studio() {
	const { user, isPending } = useCurrentUserState();
	const [mine, setMine] = (0, import_react.useState)([]);
	const [name, setName] = (0, import_react.useState)("");
	const [tagline, setTagline] = (0, import_react.useState)("");
	const [description, setDescription] = (0, import_react.useState)("");
	const [url, setUrl] = (0, import_react.useState)("");
	const [developerName, setDeveloperName] = (0, import_react.useState)("");
	const [genres, setGenres] = (0, import_react.useState)(["tools"]);
	const [paid, setPaid] = (0, import_react.useState)(false);
	const [comingSoon, setComingSoon] = (0, import_react.useState)(true);
	const [msg, setMsg] = (0, import_react.useState)(null);
	(0, import_react.useEffect)(() => {
		if (!user) return;
		myListings().then(setMine).catch(() => setMine([]));
	}, [user]);
	if (isPending) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(StoreShell, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-40 animate-pulse rounded-xl bg-raised" }) });
	if (!user) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RedirectToSignIn, {});
	const me = user;
	async function onSubmit(e) {
		e.preventDefault();
		setMsg(null);
		try {
			await submitListing({ data: {
				name,
				tagline,
				description,
				url: comingSoon ? "#" : url,
				developerName: developerName || me.displayName || "Independent",
				genres,
				paid,
				comingSoon
			} });
			setName("");
			setTagline("");
			setDescription("");
			setUrl("");
			setMsg("Listed. No APK was harmed in this publishing.");
			setMine(await myListings());
		} catch (err) {
			setMsg(err instanceof Error ? err.message : "Could not publish");
		}
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(StoreShell, { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
			className: "text-2xl font-semibold",
			children: "Developer studio"
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "mt-2 max-w-xl text-muted",
			children: "File a PWA. We take a URL, a name, and a straight face. Screening is mostly the illusion of civilization — plus the fact that you had to sign in."
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
			onSubmit,
			className: "mt-6 space-y-3 rounded-xl bg-surface p-5 ring-1 ring-border",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
					label: "App name",
					value: name,
					onChange: setName
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
					label: "Short tagline",
					value: tagline,
					onChange: setTagline
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
					className: "block",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "mb-1 block text-sm text-muted",
						children: "Description"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
						value: description,
						onChange: (e) => setDescription(e.target.value),
						className: "h-24 w-full rounded-lg border border-border bg-bg p-3 outline-none"
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
					label: "Developer name",
					value: developerName,
					onChange: setDeveloperName,
					placeholder: user.displayName ?? "Studio name"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
					className: "flex items-center gap-2 text-sm",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						type: "checkbox",
						checked: comingSoon,
						onChange: (e) => setComingSoon(e.target.checked)
					}), "Coming soon (advance notice, no live URL yet)"]
				}),
				!comingSoon ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
					label: "Live URL",
					value: url,
					onChange: setUrl,
					placeholder: "https://"
				}) : null,
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
					className: "flex items-center gap-2 text-sm",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						type: "checkbox",
						checked: paid,
						onChange: (e) => setPaid(e.target.checked)
					}), "Paid listing (honor system for now)"]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mb-2 text-sm text-muted",
					children: "Categories"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "flex flex-wrap gap-2",
					children: GENRES.map((g) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						onClick: () => setGenres((prev) => prev.includes(g) ? prev.length === 1 ? prev : prev.filter((x) => x !== g) : [...prev, g]),
						className: cn("h-9 rounded-full px-3 text-sm", genres.includes(g) ? "bg-fg text-bg" : "bg-raised text-muted"),
						children: GENRE_META[g].label
					}, g))
				})] }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "submit",
					className: "h-12 w-full rounded-full bg-primary font-semibold text-primary-fg",
					children: "Publish listing"
				}),
				msg ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-sm text-muted",
					children: msg
				}) : null
			]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
			className: "mt-8 text-sm font-semibold text-muted",
			children: "Your listings"
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
			className: "mt-3 space-y-2",
			children: mine.map((a) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
				to: "/app/$id",
				params: { id: a.id },
				className: "block rounded-xl bg-surface p-3 ring-1 ring-border",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "font-medium",
					children: a.name
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-sm text-muted",
					children: a.tagline
				})]
			}) }, a.id))
		})
	] });
}
function Field({ label, value, onChange, placeholder }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
		className: "block",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "mb-1 block text-sm text-muted",
			children: label
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
			value,
			placeholder,
			onChange: (e) => onChange(e.target.value),
			className: "h-11 w-full rounded-lg border border-border bg-bg px-3 outline-none"
		})]
	});
}
//#endregion
export { Studio as component };
