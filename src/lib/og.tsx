/**
 * Shared building blocks for Open Graph image generation via `next/og`.
 *
 * Each `opengraph-image.tsx` route imports `OG_SIZE`, `OG_CONTENT_TYPE`,
 * `loadOgFonts()` and `<OgFrame />`, then composes them into an
 * `ImageResponse`. Satori (the renderer behind `next/og`) requires:
 *
 *  - explicit width/height (no percentage flex without dimensions)
 *  - `display: flex` on any element with multiple children
 *  - real font binaries (no CSS vars), supplied via the `fonts` option
 *
 * Keeping the JSX here means individual routes stay tiny.
 */

import { siteConfig } from "@/lib/site";

export const OG_SIZE = { width: 1200, height: 630 } as const;
export const OG_CONTENT_TYPE = "image/png" as const;

export type OgFont = {
  name: string;
  data: ArrayBuffer;
  weight: 400 | 500 | 600 | 700;
  style: "normal" | "italic";
};

/**
 * Load Geist (sans, weights 400 + 600) so the OG card matches the new site
 * typography. Google Fonts serves WOFF2 by default which Satori can't parse —
 * using an older desktop browser UA forces a TTF/WOFF response that Satori
 * understands.
 */
async function fetchGoogleFont(
  family: string,
  weight: number,
  italic = false
): Promise<ArrayBuffer> {
  const familyParam = family.replace(/ /g, "+");
  const italicSegment = italic ? "ital,wght@1," : "wght@";
  const cssUrl = `https://fonts.googleapis.com/css2?family=${familyParam}:${italicSegment}${weight}&display=swap`;

  const css = await fetch(cssUrl, {
    headers: {
      // Older UA strings ask Google for non-WOFF2 formats which Satori can
      // parse directly (WOFF, TTF or OTF — not WOFF2).
      "User-Agent":
        "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/96.0.4664.110 Safari/537.36",
    },
  }).then((r) => r.text());

  // Accept the first non-WOFF2 url() — usually WOFF, sometimes TTF/OTF.
  const matches = [
    ...css.matchAll(
      /src:\s*url\((https:[^)]+)\)\s*format\(['"]?(woff|truetype|opentype)['"]?\)/g
    ),
  ];
  if (matches.length === 0) {
    throw new Error(
      `Could not extract a Satori-compatible font URL for ${family} ${weight}${italic ? "i" : ""}.`
    );
  }
  const fontUrl = matches[0][1];
  return fetch(fontUrl).then((r) => r.arrayBuffer());
}

export async function loadOgFonts(): Promise<OgFont[]> {
  // Geist 400 + 600 is enough to render the OG card — Satori can't decode
  // WOFF2, and Google sometimes refuses to serve non-WOFF2 for newer
  // variable faces (e.g. Fraunces). The typographic accent the site uses
  // is faked here with color + weight contrast.
  const [geistRegular, geistSemibold] = await Promise.all([
    fetchGoogleFont("Geist", 400),
    fetchGoogleFont("Geist", 600),
  ]);

  return [
    { name: "Geist", data: geistRegular, weight: 400, style: "normal" },
    { name: "Geist", data: geistSemibold, weight: 600, style: "normal" },
  ];
}

type OgFrameProps = {
  /** Small label above the title — e.g. "Blog · Architecture". */
  eyebrow: string;
  /** Big headline. Will wrap to 2-3 lines depending on length. */
  title: string;
  /**
   * Optional fragment of the title to italicise (rendered with Instrument
   * Serif italic) — gives the typographic accent that matches the site.
   */
  italic?: string;
  /** Optional small line above the eyebrow (e.g. "Project") used by some routes. */
  kicker?: string;
};

/**
 * Renders the standard OG card. All styling is inline because Satori does
 * not interpret CSS classes or variables.
 */
export function OgFrame({ eyebrow, title, italic, kicker }: OgFrameProps) {
  // Background colours match the light theme tokens roughly translated to
  // sRGB (Satori does not parse `oklch()`).
  const bg = "#fafaf7";
  const fg = "#0e0e0c";
  const muted = "#6b6b66";
  const brand = "#e8915a";

  // If `italic` is provided and appears in the title, render that fragment
  // in the brand color (Satori can't load the Instrument Serif italic WOFF2,
  // so we use color contrast for the accent instead).
  let parts: React.ReactNode = title;
  if (italic && title.includes(italic)) {
    const [before, ...rest] = title.split(italic);
    const after = rest.join(italic);
    parts = (
      <>
        {before}
        <span style={{ color: brand }}>{italic}</span>
        {after}
      </>
    );
  }

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        padding: "72px 80px",
        background: `radial-gradient(circle at 20% 0%, #fff3e8 0%, ${bg} 55%, ${bg} 100%)`,
        color: fg,
        fontFamily: "Geist",
      }}
    >
      {/* Top row: kicker + brand dot */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          fontSize: 22,
          color: muted,
          letterSpacing: "0.16em",
          textTransform: "uppercase",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div
            style={{
              width: 10,
              height: 10,
              borderRadius: 9999,
              background: brand,
            }}
          />
          <span>{kicker ?? siteConfig.name}</span>
        </div>
        <span style={{ color: muted }}>{eyebrow}</span>
      </div>

      {/* Middle: big title */}
      <div
        style={{
          display: "flex",
          fontSize: 92,
          lineHeight: 1.05,
          letterSpacing: "-0.02em",
          fontWeight: 600,
          maxWidth: 1040,
        }}
      >
        {parts}
      </div>

      {/* Bottom: author + URL */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          fontSize: 24,
          color: muted,
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 14,
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: 40,
              height: 40,
              borderRadius: 9999,
              background: fg,
              color: bg,
              fontFamily: "Geist",
              fontSize: 22,
              fontWeight: 600,
            }}
          >
            S
          </div>
          <span style={{ color: fg, fontWeight: 600 }}>
            {siteConfig.name}
          </span>
        </div>
        <span>{siteConfig.url.replace(/^https?:\/\//, "")}</span>
      </div>
    </div>
  );
}
