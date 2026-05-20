import type { Metadata } from "next";
import { Navbar } from "@/components/site/navbar";
import { Footer } from "@/components/site/footer";
import { Section, SectionHeader } from "@/components/site/section";
import { Reveal } from "@/components/site/reveal";
import { ProjectCard } from "@/components/site/project-card";
import { listProjects } from "@/lib/projects";

export const metadata: Metadata = {
  title: "Projects — Sharaaf Nazeer",
  description:
    "Selected work — APIs, distributed systems, mobile apps and developer tooling, across financial services and telco.",
  openGraph: {
    title: "Projects — Sharaaf Nazeer",
    description:
      "Selected work — APIs, distributed systems, mobile apps and developer tooling, across financial services and telco.",
    type: "website",
  },
};

export default async function ProjectsIndexPage() {
  const projects = await listProjects();

  return (
    <>
      <Navbar />
      <main className="flex-1">
        <Section className="pt-16 sm:pt-20 lg:pt-24">
          <SectionHeader
            eyebrow="Projects"
            title={
              <>
                Selected work, told as{" "}
                <span className="font-display italic text-muted-foreground">
                  short stories
                </span>
              </>
            }
            description="The work I find interesting tends to live at the boundary between systems — where a small architectural choice has compounding effects. Here are some that I've shipped or am shipping."
          />

          {projects.length === 0 ? (
            <p className="mt-12 text-muted-foreground">
              No projects yet — check back soon.
            </p>
          ) : (
            <div className="mt-14 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {projects.map((project, i) => (
                <Reveal key={project.slug} delay={i * 0.05}>
                  <ProjectCard project={project} />
                </Reveal>
              ))}
            </div>
          )}
        </Section>
      </main>
      <Footer />
    </>
  );
}
