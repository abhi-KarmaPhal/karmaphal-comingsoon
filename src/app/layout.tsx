import type { Metadata } from "next";
import { Cinzel, Gotu, Fira_Code } from "next/font/google";
import MotionProvider from "@/components/MotionProvider";
import "./globals.css";

const cinzel = Cinzel({
  subsets: ["latin"],
  variable: "--font-cinzel",
  weight: ["400", "500", "600", "700", "800", "900"],
});

const gotu = Gotu({
  subsets: ["latin", "devanagari"],
  variable: "--font-gotu",
  weight: "400",
});

const firaCode = Fira_Code({
  subsets: ["latin"],
  variable: "--font-mono",
});

export const metadata: Metadata = {
  title: "KarmaPhal | Architecture of the Infinite",
  description: "Bespoke IT Architecture, AI Integrations, and Digital Sovereignty.",
  icons: {
    icon: [
      {
        media: "(prefers-color-scheme: light)",
        url: "/favicon-light.png",
        href: "/favicon-light.png",
      },
      {
        media: "(prefers-color-scheme: dark)",
        url: "/favicon-dark.png",
        href: "/favicon-dark.png",
      },
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`bg-obsidian ${cinzel.variable} ${gotu.variable} ${firaCode.variable}`}>
      <body className="antialiased" suppressHydrationWarning>
        <MotionProvider>
          {children}
        </MotionProvider>
      </body>
    </html>
  );
}
