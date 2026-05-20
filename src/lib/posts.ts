import "server-only";

import fs from "node:fs/promises";
import path from "node:path";
import matter from "gray-matter";

const POSTS_DIR = path.join(process.cwd(), "content", "posts");

/**
 * Number of posts shown on a single blog-index page. Picked to fit a 3x3
 * grid on desktop. Bump this when traffic / content density warrants it.
 */
export const POSTS_PER_PAGE = 9;

export type PostFrontmatter = {
  title: string;
  description: string;
  date: string;
  /**
   * Primary category — used as the badge on cards. WordPress-imported posts
   * keep the first category here.
   */
  tag: string;
  /** All tags from the source (WordPress post_tag taxonomy). */
  tags?: string[];
  /** All categories from the source (WordPress category taxonomy). */
  categories?: string[];
  /** Public path to the post's hero / featured image. */
  coverImage?: string;
  readingTime: string;
  published?: boolean;
};

export type PostListItem = PostFrontmatter & {
  slug: string;
};

export type PostFull = PostListItem & {
  content: string;
};

async function readPostFiles(): Promise<string[]> {
  try {
    const entries = await fs.readdir(POSTS_DIR);
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
): data is PostFrontmatter {
  if (
    typeof data.title !== "string" ||
    typeof data.description !== "string" ||
    typeof data.date !== "string" ||
    typeof data.tag !== "string" ||
    typeof data.readingTime !== "string"
  ) {
    return false;
  }
  if (data.tags != null && !isStringArray(data.tags)) return false;
  if (data.categories != null && !isStringArray(data.categories)) return false;
  if (data.coverImage != null && typeof data.coverImage !== "string") {
    return false;
  }
  return true;
}

export async function listPosts(): Promise<PostListItem[]> {
  const files = await readPostFiles();

  const posts = await Promise.all(
    files.map(async (file) => {
      const slug = file.replace(/\.mdx$/, "");
      const raw = await fs.readFile(path.join(POSTS_DIR, file), "utf8");
      const { data } = matter(raw);

      if (!isValidFrontmatter(data)) {
        throw new Error(
          `Invalid frontmatter in ${file}. Required: title, description, date, tag, readingTime.`
        );
      }

      return { slug, ...data } as PostListItem;
    })
  );

  return posts
    .filter((p) => p.published !== false)
    .sort((a, b) => (a.date < b.date ? 1 : -1));
}

export async function getPost(slug: string): Promise<PostFull | null> {
  const filePath = path.join(POSTS_DIR, `${slug}.mdx`);
  let raw: string;
  try {
    raw = await fs.readFile(filePath, "utf8");
  } catch {
    return null;
  }

  const { data, content } = matter(raw);
  if (!isValidFrontmatter(data)) return null;

  return { slug, ...data, content } as PostFull;
}

export async function getAllPostSlugs(): Promise<string[]> {
  const files = await readPostFiles();
  return files.map((f) => f.replace(/\.mdx$/, ""));
}

export function formatPostDate(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

/**
 * Return the previous and next posts (by publish date) relative to `slug`.
 * "Previous" is the older post and "next" is the newer one. Returns null
 * for either end of the list.
 */
export function getAdjacentPosts(
  posts: PostListItem[],
  slug: string
): { prev?: PostListItem; next?: PostListItem } {
  const idx = posts.findIndex((p) => p.slug === slug);
  if (idx === -1) return {};
  // `posts` is sorted newest-first, so `idx + 1` is older and `idx - 1` is newer.
  return {
    prev: posts[idx + 1],
    next: posts[idx - 1],
  };
}

/**
 * Rank other posts by tag + category overlap with `post` and return the top
 * `limit`. Falls back to most-recent posts when overlap is zero so we always
 * surface something to keep readers engaged.
 */
export function getRelatedPosts(
  posts: PostListItem[],
  post: PostListItem,
  limit = 3
): PostListItem[] {
  const tagsA = new Set([
    ...(post.tags ?? []),
    ...(post.categories ?? []),
    post.tag,
  ].filter(Boolean) as string[]);

  const scored = posts
    .filter((p) => p.slug !== post.slug)
    .map((p) => {
      const tagsB = new Set([
        ...(p.tags ?? []),
        ...(p.categories ?? []),
        p.tag,
      ].filter(Boolean) as string[]);
      let score = 0;
      tagsB.forEach((t) => {
        if (tagsA.has(t)) score += 1;
      });
      return { post: p, score };
    });

  // Prefer overlap, break ties by recency (the list is already date-sorted).
  scored.sort((a, b) => b.score - a.score);

  const top = scored.slice(0, limit).map((s) => s.post);
  // If none of the top results overlap, fall back to the most recent posts.
  if (top.every((_, i) => scored[i].score === 0)) {
    return posts.filter((p) => p.slug !== post.slug).slice(0, limit);
  }
  return top;
}

/**
 * Convert a display tag (e.g. "Spring Boot", "Node.js") into a URL-safe slug
 * we can use in `/blog/tag/[tag]` routes. Round-trippable enough for our use
 * because we never need the original string back — pages just match against
 * `tagToSlug(tag) === params.tag`.
 */
export function tagToSlug(tag: string): string {
  return tag
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "") // strip diacritics
    .replace(/\+/g, "-plus")
    .replace(/#/g, "-sharp")
    .replace(/&/g, "-and-")
    .replace(/\./g, "-")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

function allTagsOf(post: PostListItem): string[] {
  const set = new Set<string>(
    [
      ...(post.tags ?? []),
      ...(post.categories ?? []),
      post.tag,
    ].filter(Boolean) as string[]
  );
  return [...set];
}

/**
 * Aggregate every distinct tag/category across published posts. Two tags
 * that slugify to the same value (e.g. "Angular" and "angular") are merged
 * into a single entry; the display label is whichever form appears first
 * in the post list. Sorted by post-count desc then alpha asc.
 */
export function getAllTags(
  posts: PostListItem[]
): { tag: string; slug: string; count: number }[] {
  type Agg = { display: string; postSlugs: Set<string> };
  const bySlug = new Map<string, Agg>();
  for (const post of posts) {
    for (const tag of allTagsOf(post)) {
      const slug = tagToSlug(tag);
      if (!slug) continue;
      let entry = bySlug.get(slug);
      if (!entry) {
        entry = { display: tag, postSlugs: new Set() };
        bySlug.set(slug, entry);
      }
      entry.postSlugs.add(post.slug);
    }
  }
  return [...bySlug.entries()]
    .map(([slug, { display, postSlugs }]) => ({
      tag: display,
      slug,
      count: postSlugs.size,
    }))
    .sort((a, b) =>
      b.count !== a.count ? b.count - a.count : a.tag.localeCompare(b.tag)
    );
}

/**
 * Return all posts whose tag/category set contains a tag matching `slug`
 * (after slugification). Preserves the input `posts` ordering.
 */
export function getPostsByTagSlug(
  posts: PostListItem[],
  slug: string
): { posts: PostListItem[]; displayTag: string | null } {
  let displayTag: string | null = null;
  const matched = posts.filter((post) => {
    const hit = allTagsOf(post).find((t) => tagToSlug(t) === slug);
    if (hit && !displayTag) displayTag = hit;
    return Boolean(hit);
  });
  return { posts: matched, displayTag };
}

export type PaginatedPosts = {
  posts: PostListItem[];
  page: number;
  pageCount: number;
  hasPrev: boolean;
  hasNext: boolean;
};

/**
 * Slice `posts` for a 1-indexed page number. Returns a stable shape that
 * pagination components can consume directly. `page <= 0` or `page > pageCount`
 * yield `pageCount = 0` so callers can `notFound()` on out-of-range pages.
 */
export function paginatePosts(
  posts: PostListItem[],
  page: number,
  perPage = POSTS_PER_PAGE
): PaginatedPosts {
  const pageCount = Math.max(1, Math.ceil(posts.length / perPage));
  const safePage = Number.isFinite(page) ? Math.max(1, Math.floor(page)) : 1;
  if (safePage > pageCount) {
    return {
      posts: [],
      page: safePage,
      pageCount,
      hasPrev: false,
      hasNext: false,
    };
  }
  const start = (safePage - 1) * perPage;
  return {
    posts: posts.slice(start, start + perPage),
    page: safePage,
    pageCount,
    hasPrev: safePage > 1,
    hasNext: safePage < pageCount,
  };
}
