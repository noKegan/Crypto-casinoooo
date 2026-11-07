import type { Metadata } from "next"
import "./globals.css"

export const metadata: Metadata = {
  title: "Neon Reel — Slot Prototype",
  description: "A virtual-credit slot machine prototype.",
}

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body>{children}</body></html>
}
