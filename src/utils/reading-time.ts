const WORDS_PER_MINUTE = 200;

/**
 * Calculates estimated reading time for a markdown string.
 * Strips YAML frontmatter, fenced code blocks, and markdown syntax before counting words.
 */
export function calculateReadTime(markdown: string): string {
  const withoutFrontmatter = markdown.replace(/^---[\s\S]*?---\n?/, '');
  const withoutFencedCode = withoutFrontmatter.replace(/```[\s\S]*?```/g, '');
  const withoutMarkdownSyntax = withoutFencedCode
    .replace(/^#{1,6}\s+/gm, '')
    .replace(/[*_`~]{1,3}/g, '')
    .replace(/!?\[([^\]]*)\]\([^)]*\)/g, '$1')
    .replace(/!?\[([^\]]*)\]\[[^\]]*\]/g, '$1');

  const words = withoutMarkdownSyntax
    .trim()
    .split(/\s+/)
    .filter((w) => w.length > 0);
  const minutes = Math.max(1, Math.ceil(words.length / WORDS_PER_MINUTE));

  return `${minutes} min read`;
}
