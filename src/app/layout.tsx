import type { ReactNode } from "react";

// Root layout is a pass-through: the real <html>/<body> live in
// app/[locale]/layout.tsx so the document lang matches the active locale
// (next-intl App Router pattern).
export default function RootLayout({ children }: { children: ReactNode }) {
  return children;
}
