import { listPosts } from "@/lib/posts";
import { absoluteUrl, siteConfig } from "@/lib/site";

// Pre-render at build time and re-validate hourly when ISR is enabled by the
// host (Vercel etc.). On a fully static export the feed is built once per
// deploy, which is the desired behaviour for a personal blog.
export const dynamic = "force-static";
export const revalidate = 3600;

/**
 * RSS 2.0 feed of published blog posts.
 */
export async function GET() {
  const posts = await listPosts();
  const now = new Date().toUTCString();
  const buildDate = posts[0]
    ? new Date(safeDate(posts[0].date)).toUTCString()
    : now;

  const items = posts
    .map((post) => {
      const url = absoluteUrl(`/blog/${post.slug}`);
      return [
        "    <item>",
        `      <title>${escapeXml(post.title)}</title>`,
        `      <link>${url}</link>`,
        `      <guid isPermaLink="true">${url}</guid>`,
        `      <pubDate>${new Date(safeDate(post.date)).toUTCString()}</pubDate>`,
        `      <description><![CDATA[${post.description}]]></description>`,
        ...(post.tags ?? []).map(
          (t) => `      <category>${escapeXml(t)}</category>`
        ),
        post.coverImage
          ? `      <enclosure url="${absoluteUrl(post.coverImage)}" type="image/png" />`
          : "",
        "    </item>",
      ]
        .filter(Boolean)
        .join("\n");
    })
    .join("\n");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${escapeXml(siteConfig.name)} — Blog</title>
    <link>${siteConfig.url}/blog</link>
    <atom:link href="${siteConfig.url}/rss.xml" rel="self" type="application/rss+xml" />
    <description>${escapeXml(siteConfig.description)}</description>
    <language>en</language>
    <lastBuildDate>${buildDate}</lastBuildDate>
    <managingEditor>${siteConfig.author.email} (${siteConfig.author.name})</managingEditor>
${items}
  </channel>
</rss>`;

  return new Response(xml, {
    headers: {
      "Content-Type": "application/rss+xml; charset=utf-8",
      "Cache-Control": "public, max-age=3600, s-maxage=3600",
    },
  });
}

function safeDate(input: string): string {
  const d = new Date(input);
  return Number.isNaN(d.getTime()) ? new Date().toISOString() : d.toISOString();
}

function escapeXml(input: string): string {
  return input
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}
