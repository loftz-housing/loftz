import { redirect } from "next/navigation";
import { routing } from "@/i18n/routing";

// The proxy (middleware) redirects `/` to the default locale on every request.
// This page is a static fallback for the same behaviour.
export default function RootPage() {
  redirect(`/${routing.defaultLocale}`);
}
