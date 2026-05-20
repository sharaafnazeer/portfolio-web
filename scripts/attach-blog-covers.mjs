/**
 * Attach blog cover images by matching image filename -> post title.
 *
 * Scans the source directory for image files, then for each image looks
 * for a post in `content/posts/` whose frontmatter `title` matches the
 * image's filename (case- and punctuation-insensitive). When a match is
 * found, the image is copied to `public/images/blog/{slug}/cover.png`
 * (or `.jpg`, preserving the original extension) and the post's
 * frontmatter gets `coverImage` inserted / updated.
 *
 * Usage:
 *   node scripts/attach-blog-covers.mjs [source-dir]
 *
 * Defaults source-dir to `tmp/`.
 */

import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import matter from "gray-matter";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT = path.resolve(__dirname, "..");

const SOURCE = path.resolve(ROOT, process.argv[2] || "tmp");
const POSTS_DIR = path.join(ROOT, "content/posts");
const IMAGES_DIR = path.join(ROOT, "public/images/blog");

const IMAGE_EXT_RE = /\.(jpe?g|png|gif|webp|avif)$/i;

function normalize(s) {
  return String(s)
    .toLowerCase()
    .replace(/\.[a-z0-9]+$/i, "") // drop extension
    .replace(/[^a-z0-9]+/g, " ") // collapse punctuation to spaces
    .replace(/\s+/g, " ")
    .trim();
}

async function readPostIndex() {
  const files = await fs.readdir(POSTS_DIR);
  const index = [];
  for (const file of files) {
    if (!file.endsWith(".mdx")) continue;
    const slug = file.replace(/\.mdx$/, "");
    const raw = await fs.readFile(path.join(POSTS_DIR, file), "utf8");
    const { data, content } = matter(raw);
    if (!data?.title) continue;
    index.push({
      file,
      slug,
      titleKey: normalize(data.title),
      slugKey: normalize(slug),
      data,
      content,
      raw,
    });
  }
  return index;
}

function findMatch(posts, imageName) {
  const key = normalize(imageName);
  return (
    posts.find((p) => p.titleKey === key) ??
    posts.find((p) => p.slugKey === key) ??
    null
  );
}

/**
 * Write frontmatter back without reformatting unrelated keys. We keep this
 * conservative — we only edit the `coverImage` line (insert if missing,
 * replace if present), leaving everything else byte-identical.
 */
function upsertCoverImage(raw, coverImage) {
  const fmMatch = raw.match(/^---\n([\s\S]*?)\n---\n?/);
  if (!fmMatch) {
    throw new Error("Could not locate frontmatter block.");
  }
  const block = fmMatch[1];
  const lines = block.split("\n");
  const idx = lines.findIndex((l) => /^coverImage\s*:/.test(l));
  const newLine = `coverImage: "${coverImage}"`;
  if (idx >= 0) {
    lines[idx] = newLine;
  } else {
    // Insert before `readingTime` if present, otherwise at the end of the block.
    const rtIdx = lines.findIndex((l) => /^readingTime\s*:/.test(l));
    if (rtIdx >= 0) {
      lines.splice(rtIdx, 0, newLine);
    } else {
      lines.push(newLine);
    }
  }
  const newBlock = lines.join("\n");
  return raw.replace(fmMatch[0], `---\n${newBlock}\n---\n`);
}

async function main() {
  console.log(`Source:  ${path.relative(ROOT, SOURCE)}`);
  console.log(`Posts:   ${path.relative(ROOT, POSTS_DIR)}`);
  console.log("");

  const posts = await readPostIndex();
  console.log(`Loaded ${posts.length} posts.`);

  let entries;
  try {
    entries = await fs.readdir(SOURCE);
  } catch (err) {
    console.error(`Cannot read source: ${err.message}`);
    process.exit(1);
  }

  const images = entries.filter((f) => IMAGE_EXT_RE.test(f));
  console.log(`Found ${images.length} candidate images.`);
  console.log("");

  const matched = new Set();
  const unmatched = [];
  for (const image of images) {
    const target = findMatch(posts, image);
    if (!target) {
      unmatched.push(image);
      continue;
    }

    const ext = path.extname(image).toLowerCase();
    const destDir = path.join(IMAGES_DIR, target.slug);
    const destFile = path.join(destDir, `cover${ext}`);
    const publicPath = `/images/blog/${target.slug}/cover${ext}`;

    await fs.mkdir(destDir, { recursive: true });
    await fs.copyFile(path.join(SOURCE, image), destFile);

    const updated = upsertCoverImage(target.raw, publicPath);
    await fs.writeFile(path.join(POSTS_DIR, target.file), updated, "utf8");

    matched.add(target.slug);
    console.log(
      `  attached: "${image}"  ->  ${target.slug}  (${publicPath})`
    );
  }

  if (unmatched.length > 0) {
    console.log("");
    console.log("Unmatched images (no post with that title):");
    for (const i of unmatched) console.log(`  - ${i}`);
  }

  console.log("");
  console.log(`Done. Covers attached: ${matched.size} / ${images.length}.`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
