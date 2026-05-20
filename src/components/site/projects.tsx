import Link from "next/link";
import { Section, SectionHeader } from "@/components/site/section";
import { Reveal } from "@/components/site/reveal";
import { ProjectCard } from "@/components/site/project-card";
import { listProjects } from "@/lib/projects";
import { ArrowUpRight } from "lucide-react";

export async function Projects() {
  const all = await listProjects();
  const featured = all.filter((p) => p.featured).slice(0, 3);
  const items = featured.length > 0 ? featured : all.slice(0, 3);

  if (items.length === 0) return null;

  return (
    <Section id="projects">
      <div className="flex flex-wrap items-end justify-between gap-6">
        <SectionHeader
          eyebrow="Selected work"
          title={
            <>
              Things I&apos;ve been{" "}
              <span className="font-display italic text-muted-foreground">
                building
              </span>
            </>
          }
        />
        <Link
          href="/projects"
          className="inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
        >
          View all projects
          <ArrowUpRight className="size-4" />
        </Link>
      </div>

      <div className="mt-14 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {items.map((project, i) => (
          <Reveal key={project.slug} delay={i * 0.05}>
            <ProjectCard project={project} />
          </Reveal>
        ))}
      </div>
    </Section>
  );
}
