#!/usr/bin/env node
/**
 * Backfill language hints on bare ``` fences across all blog MDX files.
 *
 * The WordPress importer doesn't preserve fence language metadata, so every
 * code block ships as `plaintext` and Shiki can't apply syntax colours. This
 * script applies a small library of content-based heuristics so the most
 * common languages we use (xml, java, ts, js, yaml, json, bash, http) get
 * proper highlighting. Unknown blocks are left as-is.
 *
 * Run: `node scripts/detect-langs.mjs` (writes posts in-place)
 *      `node scripts/detect-langs.mjs --dry` (prints planned edits only)
 */

import fs from "node:fs/promises";
import path from "node:path";

const POSTS_DIR = path.join(process.cwd(), "content", "posts");
const dryRun = process.argv.includes("--dry");

/**
 * Heuristics are evaluated in order; the first one that matches wins. Each
 * rule returns a language id (Shiki grammar) or null.
 *
 * Ordering rationale: high-signal/narrow languages (xml namespaces, Java
 * annotations, Angular component decorators) are checked before general
 * markup so a block with both `@Component({...})` and `<h1>` inside its
 * template is correctly classified as `ts`, not `html`.
 */
const rules = [
  // --- XML (Maven, Spring) -------------------------------------------------
  {
    name: "xml",
    test: (s) =>
      /<\?xml/.test(s) ||
      /<(dependency|dependencies|plugin|plugins|groupId|artifactId|configuration|build|project|bean|beans|parent|properties|modelVersion)\b/i.test(
        s
      ) ||
      /xmlns:[a-z]+=/.test(s),
  },
  // --- Angular / TypeScript ------------------------------------------------
  // Must come BEFORE Java (because `@Component` is also a Java annotation) and
  // BEFORE html (so Angular component templates aren't mis-tagged).
  {
    name: "ts",
    test: (s) =>
      /^\s*@Component\s*\(\s*\{/m.test(s) ||
      /\b(signal|computed|inject|effect)\s*[<(]/.test(s) ||
      /:\s*(string|number|boolean|any|void|unknown|never|Promise|Observable|Array|Record|Map|Set)\b/.test(
        s
      ) ||
      /\binterface\s+[A-Z]\w*\s*\{/.test(s) ||
      /\bexport\s+(class|interface|type|enum|function)\b/.test(s) ||
      /\*ng(For|If|Switch|Class|Style)\b/.test(s) ||
      /\[(disabled|class|style|formControl|ngModel)\]\s*=/.test(s) ||
      // TS-only generic instantiation, e.g. `new FormControl<string | null>(`.
      /\bnew\s+[A-Z]\w*\s*<[^>]+>\s*\(/.test(s) ||
      // Type-annotated variable declarations: `const xs: Routes = [`.
      /\b(const|let|var)\s+\w+\s*:\s*[A-Z]\w*[<\[\s=]/.test(s),
  },
  // --- Java / Kotlin -------------------------------------------------------
  {
    name: "java",
    test: (s) =>
      /\b(package|import)\s+[a-z][a-z0-9_.]*\s*;/m.test(s) ||
      /@(SpringBootApplication|RestController|Controller|Service|Repository|Configuration|Autowired|RequestMapping|GetMapping|PostMapping|PutMapping|DeleteMapping|Bean|Override|Transactional|Entity|Table|Column|Id|GeneratedValue)\b/.test(
        s
      ) ||
      /\b(public|private|protected)\s+(static\s+)?(final\s+)?(class|interface|enum|void|[A-Z]\w*)\b/.test(
        s
      ),
  },
  // --- JavaScript ----------------------------------------------------------
  {
    name: "js",
    test: (s) =>
      /\b(const|let|var)\s+\w+\s*=/.test(s) ||
      /\bfunction\s+\w+\s*\(/.test(s) ||
      /\b(console\.(log|error|warn|info)|require\(|module\.exports|process\.env)\b/.test(
        s
      ) ||
      /=>\s*[{(]/.test(s) ||
      // Bootstrap-style call: identifier(arg, { … }); — common in Angular/Next.
      /^\s*[a-z][\w.]*\s*\([^;]*\{[\s\S]*?\}\s*\)\s*;?\s*$/m.test(s),
  },
  // --- HTML (after ts so Angular templates aren't mis-tagged) -------------
  {
    name: "html",
    test: (s) =>
      /^\s*<!doctype\s+html/i.test(s) ||
      /<(html|head|body|main|section|article|nav|footer|header|button|input|form|label|select|option|table|thead|tbody|tr|td|th|ul|ol|li|p|a|span|div|h[1-6]|img|link|meta|script|style)\b[^>]*>/i.test(
        s
      ) ||
      // Custom-element / Angular usage tag like <app-profile>, <my-counter>.
      /<[a-z]+-[a-z][\w-]*\b/i.test(s),
  },
  // --- JSON ----------------------------------------------------------------
  {
    name: "json",
    test: (s) => {
      const trimmed = s.trim();
      if (!/^[[{]/.test(trimmed)) return false;
      // crude shape: contains "key": "value" or "key": <number/null/bool>
      return /"[\w-]+"\s*:\s*("[^"]*"|true|false|null|[\d.]+|[[{])/.test(
        trimmed
      );
    },
  },
  // --- YAML ----------------------------------------------------------------
  {
    name: "yaml",
    test: (s) => {
      const lines = s.split(/\r?\n/).filter((l) => l.trim());
      if (lines.length < 2) return false;
      // Mostly `key:` or `- value` lines, no semicolons / braces / equals.
      const yamly = lines.filter((l) =>
        /^\s*([\w-]+\s*:\s*[^{}=;<]*|-\s+[\w-]+:.*|-\s+[\w-./]+)\s*$/.test(l)
      );
      return yamly.length / lines.length >= 0.7;
    },
  },
  // --- HTTP request --------------------------------------------------------
  {
    name: "http",
    test: (s) =>
      /^\s*(GET|POST|PUT|PATCH|DELETE|HEAD|OPTIONS)\s+\/\S+\s+HTTP\/\d/im.test(
        s
      ) || /^\s*(GET|POST|PUT|PATCH|DELETE)\s+https?:\/\//im.test(s),
  },
  // --- SQL -----------------------------------------------------------------
  {
    name: "sql",
    test: (s) =>
      /\b(SELECT|INSERT\s+INTO|UPDATE|DELETE\s+FROM|CREATE\s+(TABLE|INDEX|DATABASE)|ALTER\s+TABLE|DROP\s+(TABLE|INDEX))\b/i.test(
        s
      ),
  },
  // --- Shell / Bash --------------------------------------------------------
  {
    name: "bash",
    test: (s) =>
      /^\s*(\$|#)\s+/m.test(s) ||
      /^\s*(npm|yarn|pnpm|bun|node|npx|docker(?:-compose)?|kubectl|git|curl|wget|cd|mkdir|rm|cp|mv|ls|cat|echo|export|source|chmod|chown|ssh|scp|brew|apt|apt-get|yum|dnf|pacman|systemctl|sudo)\s+/m.test(
        s
      ),
  },
];

function detectLang(code) {
  const sample = code.slice(0, 1200); // First ~1KB is plenty for fingerprinting.
  for (const rule of rules) {
    if (rule.test(sample)) return rule.name;
  }
  return null;
}

/**
 * Walks the MDX content and rewrites any bare ``` fence with a detected lang.
 * Returns { content, stats } where stats counts edits by language.
 */
function backfillFences(source) {
  const lines = source.split("\n");
  const out = [];
  const stats = {};

  let i = 0;
  while (i < lines.length) {
    const line = lines[i];
    const fenceMatch = /^(\s*)```(\s*)$/.exec(line);
    if (!fenceMatch) {
      out.push(line);
      i++;
      continue;
    }

    // Collect block body until the closing fence.
    const indent = fenceMatch[1];
    const bodyStart = i + 1;
    let bodyEnd = bodyStart;
    while (
      bodyEnd < lines.length &&
      !/^(\s*)```(\s*)$/.test(lines[bodyEnd])
    ) {
      bodyEnd++;
    }
    const body = lines.slice(bodyStart, bodyEnd).join("\n");
    const lang = detectLang(body);

    if (lang) {
      out.push(`${indent}\`\`\`${lang}`);
      stats[lang] = (stats[lang] || 0) + 1;
      if (process.env.VERBOSE) {
        console.log(
          `  + ${lang} @line ${i + 1}: ${body.split("\n")[0].slice(0, 80)}`
        );
      }
    } else {
      out.push(line);
      stats.unknown = (stats.unknown || 0) + 1;
      if (process.env.VERBOSE) {
        console.log(
          `  - unknown @line ${i + 1}:\n      ${body.split("\n").slice(0, 3).join("\n      ")}`
        );
      }
    }
    out.push(...lines.slice(bodyStart, bodyEnd));
    // Closing fence (or EOF).
    if (bodyEnd < lines.length) out.push(lines[bodyEnd]);
    i = bodyEnd + 1;
  }

  return { content: out.join("\n"), stats };
}

async function main() {
  const entries = await fs.readdir(POSTS_DIR);
  const files = entries.filter((e) => e.endsWith(".mdx"));

  const totals = {};
  let touched = 0;

  for (const file of files) {
    const full = path.join(POSTS_DIR, file);
    const raw = await fs.readFile(full, "utf8");
    const { content, stats } = backfillFences(raw);

    if (content === raw) continue;
    touched++;
    for (const [lang, count] of Object.entries(stats)) {
      totals[lang] = (totals[lang] || 0) + count;
    }

    if (dryRun) {
      const summary = Object.entries(stats)
        .map(([k, v]) => `${k}=${v}`)
        .join(", ");
      console.log(`[dry] ${file}: ${summary}`);
    } else {
      await fs.writeFile(full, content, "utf8");
      const summary = Object.entries(stats)
        .map(([k, v]) => `${k}=${v}`)
        .join(", ");
      console.log(`updated ${file} (${summary})`);
    }
  }

  console.log("");
  console.log(`Touched ${touched}/${files.length} file(s)`);
  console.log(
    "Totals:",
    Object.entries(totals)
      .map(([k, v]) => `${k}=${v}`)
      .join(", ") || "none"
  );
  if (dryRun) console.log("(dry-run — no files written)");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
