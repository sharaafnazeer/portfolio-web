import { siteConfig, absoluteUrl } from "@/lib/site";
import type { PostListItem } from "@/lib/posts";
import type { ProjectListItem } from "@/lib/projects";

function safeIsoDate(input: string): string {
  const d = new Date(input);
  if (Number.isNaN(d.getTime())) return new Date().toISOString();
  return d.toISOString();
}

/** WebSite + sitelinks search box (used on the root page). */
export function websiteSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: siteConfig.name,
    url: siteConfig.url,
    description: siteConfig.description,
    inLanguage: "en",
  };
}

/** Person schema for the site owner — wear it on the home page. */
export function personSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Person",
    name: siteConfig.author.name,
    url: siteConfig.url,
    email: `mailto:${siteConfig.author.email}`,
    jobTitle: "Software Engineer",
    sameAs: siteConfig.author.sameAs,
  };
}

/** BlogPosting schema for a blog post. */
export function blogPostingSchema(post: PostListItem) {
  const url = absoluteUrl(`/blog/${post.slug}`);
  const image = post.coverImage ? absoluteUrl(post.coverImage) : undefined;

  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    mainEntityOfPage: { "@type": "WebPage", "@id": url },
    headline: post.title,
    description: post.description,
    image,
    datePublished: safeIsoDate(post.date),
    dateModified: safeIsoDate(post.date),
    author: {
      "@type": "Person",
      name: siteConfig.author.name,
      url: siteConfig.url,
    },
    publisher: {
      "@type": "Person",
      name: siteConfig.author.name,
      url: siteConfig.url,
    },
    keywords: [...(post.tags ?? []), post.tag].filter(Boolean).join(", "),
    url,
  };
}

/** CreativeWork schema for a project. */
export function projectSchema(project: ProjectListItem) {
  const url = absoluteUrl(`/projects/${project.slug}`);
  const image = project.coverImage
    ? absoluteUrl(project.coverImage)
    : undefined;
  return {
    "@context": "https://schema.org",
    "@type": "CreativeWork",
    name: project.title,
    description: project.summary,
    url,
    image,
    keywords: project.stack.join(", "),
    author: {
      "@type": "Person",
      name: siteConfig.author.name,
      url: siteConfig.url,
    },
    dateCreated: project.period,
  };
}

/** Breadcrumb schema for nested pages. */
export function breadcrumbSchema(
  items: Array<{ name: string; url: string }>
) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, idx) => ({
      "@type": "ListItem",
      position: idx + 1,
      name: item.name,
      item: item.url,
    })),
  };
}
