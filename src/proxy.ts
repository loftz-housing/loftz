import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";

// Next.js 16 renamed the `middleware` convention to `proxy` (same functionality).
// next-intl's request handler lives here: it detects the locale and rewrites/
// redirects to the correct `/{locale}` path.
export default createMiddleware(routing);

export const config = {
  // Match everything except API routes, Next internals, and files with an extension.
  matcher: "/((?!api|_next|_vercel|.*\\..*).*)",
};
