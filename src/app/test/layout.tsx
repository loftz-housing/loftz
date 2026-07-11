import type { ReactNode } from "react";
import { Poppins, Geist } from "next/font/google";
import "../globals.css";

// Self-contained layout for the /test wireframe mockups (D-29 comparison).
// Provides its own <html>/<body> since the root layout is a pass-through and
// these pages sit outside the [locale] tree.
const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});
const geist = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });

export default function TestLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="pt" className={`${poppins.variable} ${geist.variable}`}>
      <body style={{ fontFamily: "var(--font-geist-sans), system-ui, sans-serif" }}>
        {children}
      </body>
    </html>
  );
}
