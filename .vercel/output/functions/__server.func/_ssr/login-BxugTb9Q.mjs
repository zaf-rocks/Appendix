import { _ as Link, b as require_jsx_runtime } from "../_libs/@tanstack/react-router+[...].mjs";
import { t as GROK_PROVIDERS } from "./server-DRqWKgwj.mjs";
import { r as signIn } from "./client-B40BzJxt.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/login-BxugTb9Q.js
var import_jsx_runtime = require_jsx_runtime();
function Login() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("main", {
		className: "grid min-h-dvh place-items-center bg-bg p-6 text-fg",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "w-full max-w-sm space-y-4",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
					to: "/",
					className: "text-sm text-muted",
					children: "Back to the scrapyard"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "font-display text-3xl font-semibold",
					children: "Sign in to file an app"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-sm text-muted",
					children: "Guests can browse. Developers sign in to publish a PWA — no APK, no “download now,” just a link and a listing."
				}),
				GROK_PROVIDERS.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					type: "button",
					onClick: () => signIn(p.providerId, { callbackURL: "/studio" }),
					className: "h-12 w-full rounded-full border border-border bg-surface text-sm font-medium hover:bg-raised",
					children: ["Continue with ", p.label]
				}, p.providerId))
			]
		})
	});
}
//#endregion
export { Login as component };
