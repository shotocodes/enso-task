import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

export const metadata: Metadata = {
  metadataBase: new URL("https://ensolife.app/task"),
  title: "ENSO TASK",
  description: "Turn goals into action. Manage your tasks with ENSO.",
  openGraph: { title: "ENSO TASK", description: "目標を、行動に変える", type: "website" },
  twitter: { card: "summary_large_image" },
  appleWebApp: { capable: true, statusBarStyle: "black-translucent", title: "ENSO TASK" },
};

export const viewport: Viewport = {
  width: "device-width", initialScale: 1, maximumScale: 1, userScalable: false, themeColor: "#0a0a0a",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ja" data-theme="dark">
      <head />
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`} style={{ background: "var(--bg)", color: "var(--text)" }}>
        {children}
      </body>
    </html>
  );
}
