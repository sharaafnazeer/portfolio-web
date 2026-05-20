/**
 * Single source of truth for site-level constants. Used by metadata,
 * sitemap, robots, OG image generators and JSON-LD structured data.
 *
 * Override the base URL by setting `NEXT_PUBLIC_SITE_URL` in the
 * environment when deploying to a non-canonical host (e.g. previews).
 */

import { profile } from "@/lib/data";

const fallbackUrl = "https://sharaafnazeer.com";
const envUrl = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "");

export const siteConfig = {
  name: profile.name,
  title: `${profile.name} — Software Engineer`,
  description:
    "Sharaaf Nazeer is a software engineer with 9+ years of experience building web, mobile and cloud-native products. Notes on shipping software and a portfolio of selected work.",
  url: envUrl || fallbackUrl,
  locale: "en_US",
  twitter: "@sharaafnazeer",
  author: {
    name: profile.name,
    email: profile.email,
    sameAs: [
      profile.social.github,
      profile.social.linkedin,
      profile.social.twitter,
    ].filter(Boolean),
  },
} as const;

export const SITE_URL = siteConfig.url;

/** Build a fully-qualified URL from a relative path. */
export function absoluteUrl(pathname: string): string {
  const path = pathname.startsWith("/") ? pathname : `/${pathname}`;
  return `${SITE_URL}${path}`;
}
