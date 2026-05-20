import Link from "next/link";
import Image from "next/image";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowUpRight } from "lucide-react";
import type { ProjectListItem } from "@/lib/projects";

type ProjectCardProps = {
  project: ProjectListItem;
};

const STATUS_LABEL: Record<NonNullable<ProjectListItem["status"]>, string> = {
  shipped: "Shipped",
  "in-progress": "In progress",
  archived: "Archived",
  concept: "Concept",
};

export function ProjectCard({ project }: ProjectCardProps) {
  const status = project.status ?? "shipped";

  return (
    <Link
      href={`/projects/${project.slug}`}
      className="group/proj block h-full focus:outline-none"
    >
      <Card className="h-full transition-all group-hover/proj:ring-foreground/20 group-focus-visible/proj:ring-foreground/30">
        <div className="relative aspect-[16/10] w-full overflow-hidden bg-gradient-to-br from-muted to-muted/40">
          {project.coverImage ? (
            <Image
              src={project.coverImage}
              alt={project.title}
              fill
              sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
              className="object-cover transition-transform duration-500 group-hover/proj:scale-[1.03]"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center p-6">
              <span className="font-display text-5xl italic text-muted-foreground/40 sm:text-6xl">
                {project.title
                  .split(/\s+/)
                  .slice(0, 2)
                  .map((w) => w[0])
                  .join("")}
              </span>
            </div>
          )}
          <div className="absolute left-4 top-4 flex items-center gap-2">
            <Badge variant="outline" className="h-6 bg-background/80 px-2 backdrop-blur">
              {project.tag}
            </Badge>
            {status !== "shipped" ? (
              <Badge
                variant="outline"
                className="h-6 bg-background/80 px-2 backdrop-blur"
              >
                {STATUS_LABEL[status]}
              </Badge>
            ) : null}
          </div>
        </div>

        <CardContent className="flex flex-col gap-3">
          <h3 className="font-display text-2xl leading-tight">
            {project.title}
          </h3>
          <p className="text-sm leading-relaxed text-muted-foreground">
            {project.summary}
          </p>
          <ul className="mt-1 flex flex-wrap gap-1.5">
            {project.stack.slice(0, 4).map((s) => (
              <li key={s}>
                <Badge variant="secondary" className="h-6 px-2 text-xs">
                  {s}
                </Badge>
              </li>
            ))}
            {project.stack.length > 4 ? (
              <li>
                <Badge variant="secondary" className="h-6 px-2 text-xs">
                  +{project.stack.length - 4}
                </Badge>
              </li>
            ) : null}
          </ul>
        </CardContent>

        <CardFooter className="flex items-center justify-between border-t border-border/60 pt-4 text-xs text-muted-foreground">
          <span>{project.period}</span>
          <span className="inline-flex items-center gap-1 text-foreground/80 transition-transform group-hover/proj:translate-x-0.5">
            View
            <ArrowUpRight className="size-3.5" />
          </span>
        </CardFooter>
      </Card>
    </Link>
  );
}
