/**
 * Converts a heading string into a URL-safe slug.
 * Strips special characters instead of percent-encoding them so that
 * anchor `id` attributes and TOC `href` fragments always match.
 */
export function slugify(s: string): string {
  return String(s)
    .trim()
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^\w-]/g, '');
}
