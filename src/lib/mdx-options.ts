import type { Pluggable } from "unified";
import rehypePrettyCode, {
  type Options as PrettyCodeOptions,
} from "rehype-pretty-code";
import rehypeSlug from "rehype-slug";
import rehypeAutolinkHeadings from "rehype-autolink-headings";

/**
 * Shared rehype-pretty-code config used by all MDX renders.
 *
 * Renders both light + dark colours into the same HTML by emitting CSS
 * custom properties keyed by `--shiki-light` and `--shiki-dark`. The site
 * picks the right set at runtime via the `.dark` class strategy — see the
 * `code` / `pre` rules in `globals.css`.
 */
export const prettyCodeOptions: PrettyCodeOptions = {
  theme: {
    light: "github-light",
    dark: "github-dark-dimmed",
  },
  keepBackground: false,
  defaultLang: {
    block: "plaintext",
    inline: "plaintext",
  },
  // Allow inline `code{:ts}` syntax for highlighted snippets in prose.
  bypassInlineCode: false,
};

const rehypePlugins: Pluggable[] = [
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [rehypePrettyCode as any, prettyCodeOptions],
  rehypeSlug,
  [
    rehypeAutolinkHeadings,
    {
      behavior: "wrap",
      properties: {
        className: ["heading-anchor"],
        ariaLabel: "Anchor",
      },
    },
  ],
];

/** MDX options object to pass into `<MDXRemote options={...} />`. */
export const mdxOptions = {
  mdxOptions: {
    remarkPlugins: [] as Pluggable[],
    rehypePlugins,
  },
};
