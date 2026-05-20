/**
 * Minimal, type-friendly JSON-LD injector.
 *
 * Renders a single `<script type="application/ld+json">` tag with the given
 * payload. `<` is escaped to `\u003c` to prevent any HTML in stringified data
 * from breaking out of the script context.
 *
 * Works in Server Components — it's just a script tag with no client JS.
 */

type JsonLdProps = {
  data: Record<string, unknown> | Record<string, unknown>[];
  /** Optional id for the script tag, useful for de-duping with React keys. */
  id?: string;
};

export function JsonLd({ data, id }: JsonLdProps) {
  const json = JSON.stringify(data).replace(/</g, "\\u003c");
  return (
    <script
      id={id}
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: json }}
    />
  );
}
