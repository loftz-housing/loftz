import type { ReactNode } from "react";
import { Poppins, Geist } from "next/font/google";
import "../globals.css";

// /admin sits outside [locale] (English-only), so it needs its own <html>/<body>
// (the root layout is a pass-through). Excluded from the proxy locale matcher.
export const metadata = { title: "LOFTZ Admin", robots: { index: false } };

const poppins = Poppins({ variable: "--font-poppins", subsets: ["latin"], weight: ["500", "600", "700"] });
const geist = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });

export default function AdminRootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className={`${poppins.variable} ${geist.variable}`}>
      <body className="min-h-screen bg-surface">{children}</body>
    </html>
  );
}
