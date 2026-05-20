import { ImageResponse } from "next/og";
import { OG_CONTENT_TYPE, OG_SIZE, OgFrame, loadOgFonts } from "@/lib/og";

export const alt = "Sharaaf Nazeer — Software Engineer";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export default async function Image() {
  return new ImageResponse(
    (
      <OgFrame
        kicker="Sharaaf Nazeer"
        eyebrow="Software Engineer"
        title="Building things people love."
        italic="people love"
      />
    ),
    { ...OG_SIZE, fonts: await loadOgFonts() }
  );
}
