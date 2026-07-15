import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { DashboardStateProvider } from "@/context/DashboardState";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "BlinkStore | Solana Actions Merchant Console Dashboard",
  description: "Sleek and interactive dashboard console for composing Solana Actions and deploying Blinks.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased dark`}
      style={{ colorScheme: "dark" }}
    >
      <body className="min-h-full bg-zinc-950 text-zinc-50 flex flex-col">
        <DashboardStateProvider>
          {children}
        </DashboardStateProvider>
      </body>
    </html>
  );
}
