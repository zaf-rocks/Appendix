import { createRootRoute, HeadContent, Outlet, Scripts } from "@tanstack/react-router";
import { AuthProvider } from "@/lib/auth/provider";
import { LensProvider } from "@/lib/lens";
import { PreviewHostBridge } from "@/components/preview-host-bridge";
import appCss from "../styles.css?url";

const APP_NAME = "Appendix";

/** Same public-host rule as the link-preview image: no IP, no Vercel system host. */
function publicShareHost(): string {
  const raw = String(import.meta.env.VITE_PUBLIC_HOSTNAME ?? "")
    .split(",")[0]
    .trim()
    .split(":")[0]
    .toLowerCase();
  if (!raw || !/^[a-z0-9.-]+$/.test(raw) || !raw.includes(".")) return "";
  if (/^\d{1,3}(?:\.\d{1,3}){3}$/.test(raw)) return "";
  if (
    raw === "vercel.app" ||
    raw.endsWith(".vercel.app") ||
    raw === "vercel.com" ||
    raw.endsWith(".vercel.com")
  ) {
    return "";
  }
  return raw;
}

export const Route = createRootRoute({
  head: () => {
    const host = publicShareHost();
    const xBanner = host ? `https://${host}/x-banner.jpg` : "";
    return {
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: APP_NAME },
      {
        name: "description",
        content: "Appendix — putting the Progressive in Progressive Web App.",
      },
      { property: "og:title", content: APP_NAME },
      { property: "og:description", content: "Putting the Progressive in Progressive Web App." },
      { property: "og:image", content: "/og.jpg" },
      { property: "og:image:width", content: "1200" },
      { property: "og:image:height", content: "630" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: APP_NAME },
      { name: "twitter:description", content: "Putting the Progressive in Progressive Web App." },
      { name: "twitter:image", content: "/og.jpg" },
      ...(xBanner
        ? [
            { property: "x:game:image", content: xBanner },
            { property: "x:game:image:width", content: "1200" },
            { property: "x:game:image:height", content: "264" },
          ]
        : []),
      { name: "theme-color", content: "#0e1116" },
    ],
    links: [
      { rel: "icon", type: "image/svg+xml", href: "/favicon.svg" },
      { rel: "stylesheet", href: appCss },
      { rel: "manifest", href: "/__grok/manifest.webmanifest" },
      { rel: "apple-touch-icon", href: "/__grok/icon-180.png" },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@1,9..144,500;1,9..144,600&family=IBM+Plex+Sans:ital,wght@0,400;0,500;0,600;1,400&family=Orbitron:wght@500;600;700&display=swap",
      },
    ],
    };
  },
  component: () => (
    <html lang="en" data-theme="dark" data-lens="all" suppressHydrationWarning>
      <head>
        <HeadContent />
      </head>
      <body>
        <PreviewHostBridge />
        <LensProvider>
          <AuthProvider>
            <Outlet />
          </AuthProvider>
        </LensProvider>
        <Scripts />
      </body>
    </html>
  ),
});
