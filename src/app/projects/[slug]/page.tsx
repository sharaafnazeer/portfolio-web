import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { MDXRemote } from "next-mdx-remote/rsc";
import { ArrowLeft, ArrowUpRight, ExternalLink } from "lucide-react";

import { Navbar } from "@/components/site/navbar";
import { Footer } from "@/components/site/footer";
import { Section } from "@/components/site/section";
import { Reveal } from "@/components/site/reveal";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { mdxComponents } from "@/components/site/mdx-components";
import { ProjectCard } from "@/components/site/project-card";
import {
  getAllProjectSlugs,
  getProject,
  listProjects,
  type ProjectStatus,
} from "@/lib/projects";
import { GithubIcon } from "@/components/site/social-icons";
import { JsonLd } from "@/components/site/json-ld";
import { absoluteUrl } from "@/lib/site";
import {
  breadcrumbSchema,
  projectSchema,
} from "@/lib/structured-data";

export const dynamicParams = false;

const STATUS_LABEL: Record<ProjectStatus, string> = {
  shipped: "Shipped",
  "in-progress": "In progress",
  archived: "Archived",
  concept: "Concept",
};

export async function generateStaticParams() {
  const slugs = await getAllProjectSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata(
  props: PageProps<"/projects/[slug]">
): Promise<Metadata> {
  const { slug } = await props.params;
  const project = await getProject(slug);
  if (!project) return {};

  const description = project.description ?? project.summary;
  return {
    title: `${project.title} — Sharaaf Nazeer`,
    description,
    openGraph: {
      title: project.title,
      description,
      type: "article",
    },
    twitter: {
      card: "summary_large_image",
      title: project.title,
      description,
    },
  };
}

export default async function ProjectDetailPage(
  props: PageProps<"/projects/[slug]">
) {
  const { slug } = await props.params;
  const project = await getProject(slug);
  if (!project) notFound();

  const all = await listProjects();
  const related = all.filter((p) => p.slug !== project.slug).slice(0, 2);
  const status = project.status ?? "shipped";
  const description = project.description ?? project.summary;

  return (
    <>
      <JsonLd id="ld-project" data={projectSchema(project)} />
      <JsonLd
        id="ld-breadcrumb"
        data={breadcrumbSchema([
          { name: "Projects", url: absoluteUrl("/projects") },
          { name: project.title, url: absoluteUrl(`/projects/${project.slug}`) },
        ])}
      />
      <Navbar />
      <main className="flex-1">
        <Section className="pt-16 sm:pt-20 lg:pt-24" containerClassName="max-w-4xl">
          <Reveal>
            <Link
              href="/projects"
              className="inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              <ArrowLeft className="size-4" />
              All projects
            </Link>
          </Reveal>

          <Reveal delay={0.05}>
            <header className="mt-10 flex flex-col gap-5">
              <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                <Badge variant="outline" className="h-6 px-2">
                  {project.tag}
                </Badge>
                {status !== "shipped" ? (
                  <Badge variant="outline" className="h-6 px-2">
                    {STATUS_LABEL[status]}
                  </Badge>
                ) : null}
                <span>{project.period}</span>
              </div>
              <h1 className="font-display text-balance text-4xl leading-[1.05] tracking-tight sm:text-5xl lg:text-6xl">
                {project.title}
              </h1>
              <p className="max-w-2xl text-base text-muted-foreground sm:text-lg">
                {description}
              </p>

              {project.liveUrl || project.sourceUrl || project.caseStudyUrl ? (
                <div className="mt-2 flex flex-wrap gap-2">
                  {project.liveUrl ? (
                    <Button asChild size="sm">
                      <a
                        href={project.liveUrl}
                        target="_blank"
                        rel="noreferrer"
                      >
                        Visit live
                        <ArrowUpRight />
                      </a>
                    </Button>
                  ) : null}
                  {project.sourceUrl ? (
                    <Button asChild size="sm" variant="outline">
                      <a
                        href={project.sourceUrl}
                        target="_blank"
                        rel="noreferrer"
                      >
                        <GithubIcon className="size-3.5" />
                        Source
                      </a>
                    </Button>
                  ) : null}
                  {project.caseStudyUrl ? (
                    <Button asChild size="sm" variant="outline">
                      <a
                        href={project.caseStudyUrl}
                        target="_blank"
                        rel="noreferrer"
                      >
                        <ExternalLink className="size-3.5" />
                        Case study
                      </a>
                    </Button>
                  ) : null}
                </div>
              ) : null}
            </header>
          </Reveal>

          {project.coverImage ? (
            <Reveal delay={0.08}>
              <div className="relative mt-10 aspect-[16/9] w-full overflow-hidden rounded-2xl bg-muted ring-1 ring-border">
                <Image
                  src={project.coverImage}
                  alt={project.title}
                  fill
                  priority
                  sizes="(min-width: 1024px) 896px, 100vw"
                  className="object-cover"
                />
              </div>
            </Reveal>
          ) : null}

          <Reveal delay={0.1}>
            <dl className="mt-12 grid gap-6 rounded-2xl bg-card p-6 ring-1 ring-foreground/10 sm:grid-cols-3">
              {project.role ? (
                <div className="flex flex-col gap-1">
                  <dt className="text-xs uppercase tracking-[0.16em] text-muted-foreground">
                    Role
                  </dt>
                  <dd className="text-sm">{project.role}</dd>
                </div>
              ) : null}
              {project.client ? (
                <div className="flex flex-col gap-1">
                  <dt className="text-xs uppercase tracking-[0.16em] text-muted-foreground">
                    Client
                  </dt>
                  <dd className="text-sm">{project.client}</dd>
                </div>
              ) : null}
              <div className="flex flex-col gap-1">
                <dt className="text-xs uppercase tracking-[0.16em] text-muted-foreground">
                  Stack
                </dt>
                <dd className="flex flex-wrap gap-1.5">
                  {project.stack.map((s) => (
                    <Badge key={s} variant="secondary" className="h-6 px-2 text-xs">
                      {s}
                    </Badge>
                  ))}
                </dd>
              </div>
            </dl>
          </Reveal>

          <Reveal delay={0.12}>
            <hr className="my-12 border-border" />
          </Reveal>

          <article className="font-sans">
            <MDXRemote source={project.content} components={mdxComponents} />
          </article>
        </Section>

        {related.length > 0 ? (
          <Section className="border-t border-border/60 bg-muted/40">
            <h2 className="font-display text-2xl sm:text-3xl">More work</h2>
            <div className="mt-8 grid gap-4 md:grid-cols-2">
              {related.map((p, i) => (
                <Reveal key={p.slug} delay={i * 0.05}>
                  <ProjectCard project={p} />
                </Reveal>
              ))}
            </div>
          </Section>
        ) : null}
      </main>
      <Footer />
    </>
  );
}
