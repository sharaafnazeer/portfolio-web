/**
 * One-shot importer for WordPress eXtended RSS (WXR) exports.
 *
 * - Filters to `post` post-type (skips pages/attachments/menus/etc).
 * - Converts content:encoded HTML -> Markdown via Turndown + GFM plugin.
 * - Strips Gutenberg block comments, Elementor-paste inline styles, empty paragraphs.
 * - Maps WP `category` and `post_tag` taxonomies to frontmatter `categories`/`tags`.
 * - Downloads images referenced in the body and the featured image to
 *   `public/images/blog/{slug}/`, rewriting paths to local public URLs.
 * - Writes one MDX file per post to `content/posts/{slug}.mdx`.
 * - Drafts are written with `published: false`.
 *
 * Usage: `node scripts/import-wp.mjs [path-to-wxr.xml]`
 */

import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { XMLParser } from "fast-xml-parser";
import TurndownService from "turndown";
import { gfm } from "turndown-plugin-gfm";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT = path.resolve(__dirname, "..");

const INPUT = path.resolve(
  ROOT,
  process.argv[2] || "tmp/wordpress.xml"
);
const POSTS_DIR = path.join(ROOT, "content/posts");
const IMAGES_DIR = path.join(ROOT, "public/images/blog");
const IMAGE_PUBLIC_PREFIX = "/images/blog";

const IMAGE_EXT_RE = /\.(jpe?g|png|gif|webp|avif|svg)(\?[^#]*)?(#.*)?$/i;

/** @typedef {{ title:string, link:string, slug:string, date:string, content:string, status:string, postType:string, postId:string, categories:string[], tags:string[], thumbnailId?:string }} WPPost */

// ---------- helpers ----------

function asArray(v) {
  if (v == null) return [];
  return Array.isArray(v) ? v : [v];
}

function slugify(s) {
  return String(s)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}

/**
 * MDX is stricter than Markdown:
 *  - `{...}` is treated as a JS expression
 *  - `<Word ...>` is treated as a JSX tag
 *
 * Both are common in WordPress prose (curly-brace object literals, `List<String>`
 * generics, etc.). We escape them in plain text while leaving anything inside
 * fenced code blocks and inline code spans untouched.
 */
function escapeMdxHazards(md) {
  const parts = [];
  let i = 0;
  let buf = "";

  const flushText = (text) => {
    let out = text;
    // Escape stray curlies that aren't already escaped.
    out = out.replace(/(?<!\\)\{/g, "\\{").replace(/(?<!\\)\}/g, "\\}");
    // Escape `<` when it looks like prose, e.g. `<String>`, `<Foo bar>`, `< 5`.
    // Real Markdown links `<https://...>` and the autolink form are left alone.
    out = out.replace(/<(?!\/?[a-zA-Z][\w-]*[\s>])/g, "&lt;");
    // Also escape `<Capitalised...>` (would be parsed as a JSX component) when
    // not followed by recognisable HTML attributes/closing.
    out = out.replace(
      /<([A-Z][A-Za-z0-9]*)(\s+[^>]*)?>/g,
      (_match, name, rest) => `&lt;${name}${rest ?? ""}&gt;`
    );
    parts.push(out);
  };

  while (i < md.length) {
    const ch = md[i];

    // Fenced code block: ``` ... ```
    if (ch === "`" && md.slice(i, i + 3) === "```") {
      flushText(buf);
      buf = "";
      const start = i;
      const end = md.indexOf("```", i + 3);
      if (end === -1) {
        parts.push(md.slice(start));
        i = md.length;
        break;
      }
      parts.push(md.slice(start, end + 3));
      i = end + 3;
      continue;
    }

    // Inline code span: `...`
    if (ch === "`") {
      flushText(buf);
      buf = "";
      const start = i;
      const end = md.indexOf("`", i + 1);
      if (end === -1) {
        parts.push(md.slice(start));
        i = md.length;
        break;
      }
      parts.push(md.slice(start, end + 1));
      i = end + 1;
      continue;
    }

    buf += ch;
    i += 1;
  }
  flushText(buf);
  return parts.join("");
}

function estimateReadingTime(markdown) {
  const words = markdown.split(/\s+/).filter(Boolean).length;
  const minutes = Math.max(1, Math.round(words / 200));
  return `${minutes} min read`;
}

function toIsoDate(wpDate) {
  const fallback = new Date().toISOString().slice(0, 10);
  if (!wpDate || /^0{4}/.test(wpDate)) return fallback;
  const d = new Date(wpDate.replace(" ", "T") + "Z");
  if (Number.isNaN(d.getTime())) return fallback;
  return d.toISOString().slice(0, 10);
}

function escapeYamlString(s) {
  return s
    .replace(/\\/g, "\\\\")
    .replace(/"/g, '\\"')
    .replace(/\n/g, " ")
    .trim();
}

function frontmatter(fm) {
  const lines = ["---"];
  for (const [k, v] of Object.entries(fm)) {
    if (v == null) continue;
    if (Array.isArray(v)) {
      if (v.length === 0) continue;
      lines.push(`${k}:`);
      for (const item of v) lines.push(`  - "${escapeYamlString(String(item))}"`);
    } else if (typeof v === "boolean") {
      lines.push(`${k}: ${v}`);
    } else {
      lines.push(`${k}: "${escapeYamlString(String(v))}"`);
    }
  }
  lines.push("---", "");
  return lines.join("\n");
}

// ---------- HTML cleaning ----------

/**
 * Remove the worst WordPress/Elementor noise before handing HTML to Turndown.
 */
function preCleanHtml(html) {
  let out = html || "";

  // Strip Gutenberg block delimiters: HTML comments that wrap blocks.
  // After unwrapping, also strip the orphan <p><!-- ... --></p> wrappers.
  out = out.replace(/<!--\s*\/?wp:[^>]*-->/g, "");
  out = out.replace(/<p>\s*<\/p>/g, "");

  // Strip the gigantic inline style attributes WP/Word/Medium leaves behind.
  out = out.replace(/\sstyle="[^"]*"/g, "");

  // Drop empty <br /> chains in paragraphs (very common after style strip).
  out = out.replace(/(<br\s*\/?>\s*){2,}/g, "<br />");

  // Strip useless data-* attributes that bloat output.
  out = out.replace(/\sdata-[a-z0-9-]+="[^"]*"/g, "");

  // Normalize WP smart quotes / whitespace.
  out = out.replace(/\u00a0/g, " ");

  return out;
}

// ---------- Turndown setup ----------

function makeTurndown() {
  const td = new TurndownService({
    headingStyle: "atx",
    codeBlockStyle: "fenced",
    bulletListMarker: "-",
    emDelimiter: "_",
    hr: "---",
  });
  td.use(gfm);

  // Preserve language hint for fenced code if the <code> has class="language-xxx".
  td.addRule("fencedCodeWithLang", {
    filter: (node) =>
      node.nodeName === "PRE" &&
      node.firstChild &&
      node.firstChild.nodeName === "CODE",
    replacement: (_content, node) => {
      const code = node.firstChild;
      const className = code.getAttribute("class") || "";
      const langMatch = className.match(/language-([\w+-]+)/);
      const lang = langMatch ? langMatch[1] : "";
      const text = code.textContent || "";
      return `\n\n\`\`\`${lang}\n${text.replace(/\n$/, "")}\n\`\`\`\n\n`;
    },
  });

  // Strip <span> wrappers entirely (WP often nests style-only spans around text).
  td.addRule("stripSpans", {
    filter: "span",
    replacement: (content) => content,
  });

  // Drop stray <figure>/<figcaption> attributes; keep contents.
  td.addRule("unwrapFigure", {
    filter: ["figure", "figcaption"],
    replacement: (content) => `\n\n${content}\n\n`,
  });

  return td;
}

// ---------- XML parsing ----------

async function parseWxr(filepath) {
  const xml = await fs.readFile(filepath, "utf8");
  const parser = new XMLParser({
    ignoreAttributes: false,
    attributeNamePrefix: "@_",
    cdataPropName: "#cdata",
    parseTagValue: false,
    trimValues: true,
    isArray: (name) =>
      [
        "item",
        "category",
        "wp:postmeta",
        "wp:comment",
        "wp:author",
        "wp:category",
        "wp:tag",
      ].includes(name),
  });

  const doc = parser.parse(xml);
  const channel = doc?.rss?.channel;
  if (!channel) throw new Error("Could not find <channel> in XML.");
  return channel;
}

function textOf(v) {
  if (v == null) return "";
  if (typeof v === "string") return v;
  if (typeof v === "number") return String(v);
  if (typeof v === "object") {
    if ("#cdata" in v) {
      const c = v["#cdata"];
      return Array.isArray(c) ? c.join("") : String(c);
    }
    if ("#text" in v) return String(v["#text"]);
  }
  return "";
}

/**
 * Walk an item and project to a normalized post.
 */
function projectItem(item) {
  const categories = [];
  const tags = [];
  for (const c of asArray(item.category)) {
    const domain = c["@_domain"];
    const name = textOf(c);
    if (!name) continue;
    if (domain === "category") categories.push(name);
    else if (domain === "post_tag") tags.push(name);
  }

  let thumbnailId;
  for (const meta of asArray(item["wp:postmeta"])) {
    if (textOf(meta["wp:meta_key"]) === "_thumbnail_id") {
      thumbnailId = textOf(meta["wp:meta_value"]);
    }
  }

  return {
    title: textOf(item.title),
    link: textOf(item.link),
    slug: textOf(item["wp:post_name"]),
    date: textOf(item["wp:post_date_gmt"]) || textOf(item["wp:post_date"]),
    content: textOf(item["content:encoded"]),
    excerpt: textOf(item["excerpt:encoded"]),
    status: textOf(item["wp:status"]),
    postType: textOf(item["wp:post_type"]),
    postId: textOf(item["wp:post_id"]),
    categories: [...new Set(categories)],
    tags: [...new Set(tags)],
    thumbnailId,
  };
}

function buildAttachmentMap(items) {
  /** @type {Map<string,string>} attachmentPostId -> url */
  const byId = new Map();
  for (const raw of items) {
    if (textOf(raw["wp:post_type"]) !== "attachment") continue;
    const id = textOf(raw["wp:post_id"]);
    const url = textOf(raw["wp:attachment_url"]);
    if (id && url) byId.set(id, url);
  }
  return byId;
}

// ---------- Image download ----------

async function downloadImage(url, destDir) {
  await fs.mkdir(destDir, { recursive: true });
  let filename = path.basename(new URL(url).pathname).split("?")[0];
  if (!filename) filename = "image";
  if (!/\.(jpe?g|png|gif|webp|avif|svg)$/i.test(filename)) {
    // Fall back to extension from URL; otherwise default to .jpg
    filename = filename + ".jpg";
  }
  const dest = path.join(destDir, filename);
  try {
    await fs.access(dest);
    return filename;
  } catch {
    /* not cached, proceed to download */
  }
  const res = await fetch(url, {
    headers: {
      "User-Agent":
        "Mozilla/5.0 (compatible; PortfolioImporter/1.0; +http://localhost)",
    },
  });
  if (!res.ok) {
    throw new Error(`HTTP ${res.status} for ${url}`);
  }
  const buf = Buffer.from(await res.arrayBuffer());
  await fs.writeFile(dest, buf);
  return filename;
}

/**
 * Inline `data:image/...;base64,...` URLs embedded in HTML (typically from
 * pasted screenshots) are extracted to real image files in `destDir` and the
 * HTML is rewritten to reference the local public path.
 */
async function extractDataUriImages(html, destDir, publicPrefix) {
  await fs.mkdir(destDir, { recursive: true });
  const re = /data:image\/([a-zA-Z+]+);base64,([A-Za-z0-9+/=]+)/g;
  /** @type {Array<{match:string, replacement:string}>} */
  const replacements = [];
  const seen = new Map();
  let count = 0;
  let m;
  while ((m = re.exec(html)) !== null) {
    const [match, ext, b64] = m;
    if (seen.has(b64)) {
      replacements.push({ match, replacement: seen.get(b64) });
      continue;
    }
    count += 1;
    const safeExt = ext.toLowerCase().replace("svg+xml", "svg");
    const filename = `inline-${String(count).padStart(2, "0")}.${safeExt}`;
    const dest = path.join(destDir, filename);
    const buf = Buffer.from(b64, "base64");
    await fs.writeFile(dest, buf);
    const publicPath = `${publicPrefix}/${filename}`;
    seen.set(b64, publicPath);
    replacements.push({ match, replacement: publicPath });
  }
  let out = html;
  for (const r of replacements) {
    out = out.split(r.match).join(r.replacement);
  }
  return { html: out, count };
}

// ---------- Main ----------

async function main() {
  console.log(`Reading: ${path.relative(ROOT, INPUT)}`);
  const channel = await parseWxr(INPUT);
  const items = asArray(channel.item);
  console.log(`Items in feed: ${items.length}`);

  const attachmentById = buildAttachmentMap(items);

  // Build a slug map first so internal link rewriting can resolve old URLs.
  const allPosts = items
    .map(projectItem)
    .filter((p) => p.postType === "post");

  const slugByLink = new Map();
  for (const p of allPosts) {
    if (p.link && p.slug) slugByLink.set(p.link.replace(/\/$/, ""), p.slug);
  }

  const td = makeTurndown();
  await fs.mkdir(POSTS_DIR, { recursive: true });
  await fs.mkdir(IMAGES_DIR, { recursive: true });

  const report = { written: 0, drafts: 0, skipped: 0, imagesDownloaded: 0, imageErrors: [] };

  for (const post of allPosts) {
    if (!post.title) {
      report.skipped++;
      continue;
    }

    const slug = post.slug || slugify(post.title);
    if (!slug) {
      report.skipped++;
      continue;
    }

    const isDraft = post.status !== "publish";
    if (isDraft) report.drafts++;

    // 1) Pre-clean and 2) rewrite internal links to new /blog/{slug}
    let html = preCleanHtml(post.content);

    const slugImageDirEarly = path.join(IMAGES_DIR, slug);
    const slugImagePublicEarly = `${IMAGE_PUBLIC_PREFIX}/${slug}`;
    const dataUriResult = await extractDataUriImages(
      html,
      slugImageDirEarly,
      slugImagePublicEarly
    );
    html = dataUriResult.html;
    if (dataUriResult.count > 0) {
      report.imagesDownloaded += dataUriResult.count;
    }

    for (const [oldUrl, targetSlug] of slugByLink) {
      // Match the old URL with or without trailing slash, in href/src attrs and plain text.
      const re = new RegExp(
        oldUrl.replace(/[.*+?^${}()|[\]\\]/g, "\\$&") + "\\/?",
        "g"
      );
      html = html.replace(re, `/blog/${targetSlug}`);
    }

    // 3) Collect image URLs that point to the old WP site for download.
    const slugImageDir = path.join(IMAGES_DIR, slug);
    const slugImagePublic = `${IMAGE_PUBLIC_PREFIX}/${slug}`;
    /** @type {Map<string,string>} originalUrl -> publicPath */
    const replacements = new Map();
    const imgUrlRe = /(?:src|href)="(https?:\/\/[^"]+)"/g;
    const seen = new Set();
    let m;
    while ((m = imgUrlRe.exec(html)) !== null) {
      const url = m[1];
      if (!IMAGE_EXT_RE.test(url) || seen.has(url)) continue;
      seen.add(url);
      try {
        const filename = await downloadImage(url, slugImageDir);
        replacements.set(url, `${slugImagePublic}/${filename}`);
        report.imagesDownloaded++;
      } catch (err) {
        report.imageErrors.push({ post: slug, url, error: err.message });
      }
    }

    // 4) Featured image (thumbnail) — also download into the slug dir.
    let coverImage;
    if (post.thumbnailId && attachmentById.has(post.thumbnailId)) {
      const url = attachmentById.get(post.thumbnailId);
      if (IMAGE_EXT_RE.test(url)) {
        try {
          const filename = await downloadImage(url, slugImageDir);
          coverImage = `${slugImagePublic}/${filename}`;
          report.imagesDownloaded++;
        } catch (err) {
          report.imageErrors.push({ post: slug, url, error: err.message });
        }
      }
    }

    // 5) Apply replacements.
    for (const [from, to] of replacements) {
      html = html.split(from).join(to);
    }

    // 6) HTML -> Markdown.
    let markdown = td.turndown(html).trim();

    // Collapse excessive blank lines.
    markdown = markdown.replace(/\n{3,}/g, "\n\n");

    // Make the markdown safe for MDX (escape `{`, `}`, stray `<...>`).
    markdown = escapeMdxHazards(markdown);

    // 7) Build description from excerpt or first paragraph (<=200 chars).
    let description = post.excerpt
      ? post.excerpt.replace(/<[^>]+>/g, "").trim()
      : "";
    if (!description) {
      const firstPara = markdown
        .split(/\n{2,}/)
        .map((p) => p.replace(/[#>*_`-]/g, "").trim())
        .find((p) => p.length > 40);
      description = (firstPara || post.title).slice(0, 200);
    }

    // 8) Pick primary tag/category.
    const primary =
      post.categories.find((c) => c.toLowerCase() !== "uncategorized") ||
      post.categories[0] ||
      post.tags[0] ||
      "General";

    const fm = {
      title: post.title,
      description,
      date: toIsoDate(post.date),
      tag: primary,
      categories: post.categories,
      tags: post.tags,
      coverImage,
      readingTime: estimateReadingTime(markdown),
      published: !isDraft,
    };

    const file = path.join(POSTS_DIR, `${slug}.mdx`);
    await fs.writeFile(file, frontmatter(fm) + markdown + "\n", "utf8");
    report.written++;
    console.log(
      `  ${isDraft ? "draft" : "post "}  ${slug}  (${post.categories.join(", ") || "—"})`
    );
  }

  console.log("");
  console.log("Done.");
  console.log(`  Posts written:      ${report.written}`);
  console.log(`  Drafts:             ${report.drafts}`);
  console.log(`  Skipped items:      ${report.skipped}`);
  console.log(`  Images downloaded:  ${report.imagesDownloaded}`);
  if (report.imageErrors.length > 0) {
    console.log(`  Image errors (${report.imageErrors.length}):`);
    for (const e of report.imageErrors) {
      console.log(`    ${e.post}: ${e.url}  -- ${e.error}`);
    }
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
