import type { Metadata } from "next";
import { Fraunces, Geist, JetBrains_Mono } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import "./globals.css";
import { cn } from "@/lib/utils";
import { siteConfig } from "@/lib/site";
import { ThemeProvider } from "@/components/site/theme-provider";

// Geist (Vercel's grotesque) carries the body copy — clean, modern, neutral
// enough to let the display face do the talking.
const geist = Geist({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

// Fraunces is the personality of the site — used for the homepage headline,
// every italic accent ("end-to-end", "drifted off", etc.) and the brand
// "S" mark. We pull in the `opsz` axis so we can dial up the display optical
// size on the hero, and ship both normal + italic styles.
const fraunces = Fraunces({
  subsets: ["latin"],
  style: ["normal", "italic"],
  variable: "--font-display",
  display: "swap",
  axes: ["opsz", "SOFT"],
});

// JetBrains Mono replaces Geist Mono in code blocks — designed specifically
// for code (true italics, distinctive zero/letterforms) with a touch more
// character than Geist Mono.
const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: siteConfig.title,
    template: `%s — ${siteConfig.name}`,
  },
  description: siteConfig.description,
  authors: [{ name: siteConfig.author.name, url: siteConfig.url }],
  creator: siteConfig.author.name,
  openGraph: {
    type: "website",
    locale: siteConfig.locale,
    url: siteConfig.url,
    siteName: siteConfig.name,
    title: siteConfig.title,
    description: siteConfig.description,
  },
  twitter: {
    card: "summary_large_image",
    title: siteConfig.title,
    description: siteConfig.description,
    creator: siteConfig.twitter,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  alternates: {
    canonical: "/",
    types: {
      "application/rss+xml": [
        { url: "/rss.xml", title: `${siteConfig.name} — Blog (RSS)` },
      ],
      "application/atom+xml": [
        { url: "/atom.xml", title: `${siteConfig.name} — Blog (Atom)` },
      ],
    },
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={cn(
        "h-full antialiased scroll-smooth",
        geist.variable,
        fraunces.variable,
        jetbrainsMono.variable
      )}
    >
      <body className="min-h-full flex flex-col font-sans bg-background text-foreground">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
        {/* Vercel Web Analytics (page views, referrers) and Speed Insights
            (Core Web Vitals reporting). Both auto no-op outside production
            and on Vercel previews without the env hook-up, so they are safe
            to leave mounted in development. */}
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
