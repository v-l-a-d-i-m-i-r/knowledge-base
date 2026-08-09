declare module 'markdown-it-table-of-contents' {
  import MarkdownIt from 'markdown-it';

  interface TocOptions {
    includeLevel?: number[];
    containerClass?: string;
    slugify?: (str: string) => string;
    markerPattern?: RegExp;
    listType?: 'ul' | 'ol';
    format?: (content: string, md: MarkdownIt) => string;
    forceFullToc?: boolean;
    containerHeaderHtml?: string;
    containerFooterHtml?: string;
    transformLink?: (href: string) => string;
  }

  function toc(md: MarkdownIt, options?: TocOptions): void;
  export = toc;
}
