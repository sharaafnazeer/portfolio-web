import { ImageResponse } from "next/og";
import { notFound } from "next/navigation";
import {
  OG_CONTENT_TYPE,
  OG_SIZE,
  OgFrame,
  loadOgFonts,
} from "@/lib/og";
import { getAllPostSlugs, getPost } from "@/lib/posts";

export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export async function generateStaticParams() {
  const slugs = await getAllPostSlugs();
  return slugs.map((slug) => ({ slug }));
}

export const alt = "Sharaaf Nazeer — Blog";

export default async function Image({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = await getPost(slug);
  if (!post) notFound();

  return new ImageResponse(
    (
      <OgFrame
        kicker="Blog"
        eyebrow={post.tag}
        title={post.title}
      />
    ),
    { ...OG_SIZE, fonts: await loadOgFonts() }
  );
}
