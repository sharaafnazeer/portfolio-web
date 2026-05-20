import { listPosts } from "@/lib/posts";
import { absoluteUrl, siteConfig } from "@/lib/site";

export const dynamic = "force-static";
export const revalidate = 3600;

/**
 * Atom 1.0 feed of published blog posts.
 *
 * Some readers (e.g. NetNewsWire on iOS, Feedbin) prefer Atom over RSS for
 * its better date semantics and well-defined author metadata.
 */
export async function GET() {
  const posts = await listPosts();
  const updated = posts[0]
    ? new Date(safeDate(posts[0].date)).toISOString()
    : new Date().toISOString();
  const feedId = `${siteConfig.url}/atom.xml`;

  const entries = posts
    .map((post) => {
      const url = absoluteUrl(`/blog/${post.slug}`);
      return [
        "  <entry>",
        `    <id>${url}</id>`,
        `    <title>${escapeXml(post.title)}</title>`,
        `    <link rel="alternate" type="text/html" href="${url}" />`,
        `    <updated>${new Date(safeDate(post.date)).toISOString()}</updated>`,
        `    <published>${new Date(safeDate(post.date)).toISOString()}</published>`,
        `    <summary type="html"><![CDATA[${post.description}]]></summary>`,
        ...(post.tags ?? []).map(
          (t) => `    <category term="${escapeXml(t)}" />`
        ),
        "  </entry>",
      ].join("\n");
    })
    .join("\n");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<feed xmlns="http://www.w3.org/2005/Atom">
  <id>${feedId}</id>
  <title>${escapeXml(siteConfig.name)} — Blog</title>
  <subtitle>${escapeXml(siteConfig.description)}</subtitle>
  <link rel="alternate" type="text/html" href="${siteConfig.url}/blog" />
  <link rel="self" type="application/atom+xml" href="${feedId}" />
  <updated>${updated}</updated>
  <author>
    <name>${escapeXml(siteConfig.author.name)}</name>
    <email>${siteConfig.author.email}</email>
    <uri>${siteConfig.url}</uri>
  </author>
${entries}
</feed>`;

  return new Response(xml, {
    headers: {
      "Content-Type": "application/atom+xml; charset=utf-8",
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
