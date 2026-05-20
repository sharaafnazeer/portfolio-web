import { ImageResponse } from "next/og";
import { notFound } from "next/navigation";
import {
  OG_CONTENT_TYPE,
  OG_SIZE,
  OgFrame,
  loadOgFonts,
} from "@/lib/og";
import { getAllProjectSlugs, getProject } from "@/lib/projects";

export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export async function generateStaticParams() {
  const slugs = await getAllProjectSlugs();
  return slugs.map((slug) => ({ slug }));
}

export const alt = "Sharaaf Nazeer — Project";

export default async function Image({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const project = await getProject(slug);
  if (!project) notFound();

  return new ImageResponse(
    (
      <OgFrame
        kicker="Project"
        eyebrow={`${project.tag} · ${project.period}`}
        title={project.title}
      />
    ),
    { ...OG_SIZE, fonts: await loadOgFonts() }
  );
}
