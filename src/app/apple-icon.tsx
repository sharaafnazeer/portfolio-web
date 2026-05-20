import { ImageResponse } from "next/og";
import { loadOgFonts } from "@/lib/og";

/**
 * 180×180 PNG used by iOS / iPadOS for the home-screen icon (and by Safari
 * for pinned bookmarks). Apple does not accept SVG here, so we render the
 * same brand mark — solid background + bold "S" — through `next/og`.
 *
 * Why a solid square (not a circle): iOS applies its own squircle mask on
 * the home screen and shows the full square on the share sheet, so a
 * full-bleed background reads cleaner across both contexts. We re-use the
 * Figtree font loader that already powers the OG images for a consistent
 * mark across the social-share surface.
 */

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default async function AppleIcon() {
  const fonts = await loadOgFonts();

  const bg = "#0a0a0a";
  const fg = "#fafafa";

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          background: bg,
          color: fg,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: "Figtree",
          fontWeight: 600,
          fontSize: 128,
          letterSpacing: "-0.04em",
          lineHeight: 1,
        }}
      >
        S
      </div>
    ),
    { ...size, fonts }
  );
}
