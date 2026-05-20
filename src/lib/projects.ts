import "server-only";

import fs from "node:fs/promises";
import path from "node:path";
import matter from "gray-matter";

const PROJECTS_DIR = path.join(process.cwd(), "content", "projects");

export type ProjectStatus = "shipped" | "in-progress" | "archived" | "concept";

export type ProjectFrontmatter = {
  /** Display name of the project. */
  title: string;
  /** One-line summary used on cards and the home grid. */
  summary: string;
  /**
   * Longer description shown on the detail page header. Optional — defaults to
   * summary on the detail page.
   */
  description?: string;
  /** Human-readable timeframe, e.g. "2024" or "2023 — 2024". */
  period: string;
  /** Your role on the project, e.g. "Lead Engineer". */
  role?: string;
  /** Optional client / company / organisation. */
  client?: string;
  /** Stack / technologies. Shown as badges. */
  stack: string[];
  /** Project category, used as the badge on cards. */
  tag: string;
  /** Public path to the cover / hero image. */
  coverImage?: string;
  /** External links. */
  liveUrl?: string;
  sourceUrl?: string;
  caseStudyUrl?: string;
  /** Lifecycle. Defaults to "shipped". */
  status?: ProjectStatus;
  /** Featured on the home page. */
  featured?: boolean;
  /** Draft toggle. */
  published?: boolean;
  /**
   * Manual sort order — lower comes first. Falls back to ordering by
   * inferred date / period.
   */
  order?: number;
};

export type ProjectListItem = ProjectFrontmatter & {
  slug: string;
};

export type ProjectFull = ProjectListItem & {
  content: string;
};

async function readProjectFiles(): Promise<string[]> {
  try {
    const entries = await fs.readdir(PROJECTS_DIR);
    return entries.filter((name) => name.endsWith(".mdx"));
  } catch {
    return [];
  }
}

function isStringArray(v: unknown): v is string[] {
  return Array.isArray(v) && v.every((x) => typeof x === "string");
}

function isValidFrontmatter(
  data: Record<string, unknown>
): data is ProjectFrontmatter {
  if (
    typeof data.title !== "string" ||
    typeof data.summary !== "string" ||
    typeof data.period !== "string" ||
    typeof data.tag !== "string" ||
    !isStringArray(data.stack)
  ) {
    return false;
  }
  return true;
}

function inferSortKey(p: ProjectFrontmatter): number {
  if (typeof p.order === "number") return p.order;
  // Parse the latest 4-digit year from the period for fallback sort.
  const years = (p.period.match(/\d{4}/g) ?? []).map(Number);
  const year = years.length > 0 ? Math.max(...years) : 0;
  return 10_000 - year;
}

export async function listProjects(): Promise<ProjectListItem[]> {
  const files = await readProjectFiles();

  const projects = await Promise.all(
    files.map(async (file) => {
      const slug = file.replace(/\.mdx$/, "");
      const raw = await fs.readFile(path.join(PROJECTS_DIR, file), "utf8");
      const { data } = matter(raw);

      if (!isValidFrontmatter(data)) {
        throw new Error(
          `Invalid frontmatter in ${file}. Required: title, summary, period, tag, stack[].`
        );
      }

      return { slug, ...data } as ProjectListItem;
    })
  );

  return projects
    .filter((p) => p.published !== false)
    .sort((a, b) => inferSortKey(a) - inferSortKey(b));
}

export async function getProject(slug: string): Promise<ProjectFull | null> {
  const filePath = path.join(PROJECTS_DIR, `${slug}.mdx`);
  let raw: string;
  try {
    raw = await fs.readFile(filePath, "utf8");
  } catch {
    return null;
  }

  const { data, content } = matter(raw);
  if (!isValidFrontmatter(data)) return null;

  return { slug, ...data, content } as ProjectFull;
}

export async function getAllProjectSlugs(): Promise<string[]> {
  const files = await readProjectFiles();
  return files.map((f) => f.replace(/\.mdx$/, ""));
}
