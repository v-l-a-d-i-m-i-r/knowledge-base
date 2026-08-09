import markdownIt from 'markdown-it';
import anchor from 'markdown-it-anchor';
import toc from 'markdown-it-table-of-contents';

import { slugify } from '../src/utils/slugify';

function createMd(): markdownIt {
  const md = markdownIt();

  md.use(anchor, {
    level: 2,
    slugify,
    permalink: anchor.permalink.headerLink(),
    tabIndex: -1,
  });
  md.use(toc, { includeLevel: [2, 3, 4, 5, 6], slugify });

  return md;
}

/** Extract all heading id values from rendered HTML. */
function extractHeadingIds(html: string): string[] {
  return [...html.matchAll(/<h[2-6][^>]*\sid="([^"]+)"/g)].map((m) => m[1]);
}

/** Extract all TOC anchor href values (fragment only, without #) from rendered HTML. */
function extractTocHrefs(html: string): string[] {
  const tocStart = html.indexOf('<div class="table-of-contents">');
  const tocEnd = html.indexOf('</div>', tocStart) + '</div>'.length;
  const tocHtml = html.substring(tocStart, tocEnd);
  return [...tocHtml.matchAll(/href="#([^"]+)"/g)].map((m) => m[1]);
}

/** Assert every TOC href has a matching heading id and vice-versa. */
function expectAnchorsToMatch(html: string): void {
  const ids = extractHeadingIds(html);
  const hrefs = extractTocHrefs(html);

  expect(hrefs.length).toBeGreaterThan(0);
  expect(ids).toEqual(hrefs);
}

describe('Table of Contents generation', () => {
  describe('TOC HTML structure', () => {
    it('produces a nested <ul> TOC for h2-h6 headings', () => {
      const md = createMd();
      const input = `[[toc]]

## Section One

### Section Two

#### Section Three

##### Section Four

###### Section Five
`;

      const html = md.render(input);

      expect(html).toContain('<ul>');
      expect(html).toContain('<li>');
      expect(html).toContain('Section One');
      expect(html).toContain('Section Two');
      expect(html).toContain('Section Three');
      expect(html).toContain('Section Four');
      expect(html).toContain('Section Five');
    });

    it('produces nested lists reflecting heading hierarchy', () => {
      const md = createMd();
      const input = `[[toc]]

## Level Two

### Level Three
`;

      const html = md.render(input);
      const tocStart = html.indexOf('<div class="table-of-contents">');
      const tocEnd = html.indexOf('</div>', tocStart) + '</div>'.length;
      const tocHtml = html.substring(tocStart, tocEnd);

      expect(tocHtml).toContain('<ul>');
      expect(tocHtml).toContain('Level Two');
      expect(tocHtml).toContain('Level Three');

      const firstUlPos = tocHtml.indexOf('<ul>');
      const innerUlPos = tocHtml.indexOf('<ul>', firstUlPos + 1);

      expect(innerUlPos).toBeGreaterThan(firstUlPos);
    });
  });

  describe('Heading anchor IDs and TOC href matching', () => {
    it('matches for simple headings', () => {
      const html = createMd().render(`[[toc]]\n\n## My Heading\n`);
      expectAnchorsToMatch(html);
      expect(html).toMatch(/id="my-heading"/);
    });

    it('matches for h3 headings', () => {
      const html = createMd().render(`[[toc]]\n\n## Parent\n\n### Child Heading\n`);
      expectAnchorsToMatch(html);
    });

    it('matches for h6 headings', () => {
      const html = createMd().render(`[[toc]]\n\n## Top\n\n###### Deep Heading\n`);
      expectAnchorsToMatch(html);
    });

    it('matches for headings with colons', () => {
      const html = createMd().render(`[[toc]]\n\n## Step 1: Install\n`);
      expectAnchorsToMatch(html);
      expect(html).not.toMatch(/%3A/);
    });

    it('matches for headings with parentheses', () => {
      const html = createMd().render(`[[toc]]\n\n## Mount (using gparted)\n`);
      expectAnchorsToMatch(html);
      expect(html).not.toMatch(/%28|%29/);
    });

    it('matches for headings with commas', () => {
      const html = createMd().render(`[[toc]]\n\n## Foo, Bar, Baz\n`);
      expectAnchorsToMatch(html);
      expect(html).not.toMatch(/%2C/);
    });

    it('matches for headings with apostrophes', () => {
      const html = createMd().render(`[[toc]]\n\n## Sync the pacman's databases\n`);
      expectAnchorsToMatch(html);
      expect(html).not.toMatch(/%27/);
    });

    it('matches for headings with slashes', () => {
      const html = createMd().render(`[[toc]]\n\n## Mount to /mnt folder\n`);
      expectAnchorsToMatch(html);
      expect(html).not.toMatch(/%2F/);
    });

    it('matches for headings with mixed special chars (arch-install style)', () => {
      const html = createMd().render(
        `[[toc]]\n\n## Enable root (username: manjaro, password: manjaro)\n`,
      );
      expectAnchorsToMatch(html);
      expect(html).not.toMatch(/%[0-9A-Fa-f]{2}/);
    });

    it('matches for headings with numbered prefixes', () => {
      const html = createMd().render(`[[toc]]

## 1. Patch the mirrorlist file

## 2. Install arch scripts

## 3. Add and format partitions (using gparted)
`);
      expectAnchorsToMatch(html);
    });

    it('matches for headings with uppercase letters', () => {
      const html = createMd().render(`[[toc]]\n\n## Install and Configure GRUB\n`);
      expectAnchorsToMatch(html);
      expect(html).toMatch(/id="install-and-configure-grub"/);
    });

    it('matches for headings with multiple consecutive spaces', () => {
      const html = createMd().render(`[[toc]]\n\n## Hello   World\n`);
      expectAnchorsToMatch(html);
    });

    it('produces no percent-encoded characters in any anchor id or href', () => {
      const html = createMd().render(`[[toc]]

## Step 1: Setup (username: admin, password: secret)

### Mount /mnt/boot

#### pacman's cache & logs

##### Hostname (e.g my-pc)

###### Done!
`);
      expectAnchorsToMatch(html);
      const ids = extractHeadingIds(html);
      const hrefs = extractTocHrefs(html);
      [...ids, ...hrefs].forEach((value) => {
        expect(value).not.toMatch(/%[0-9A-Fa-f]{2}/);
      });
    });

    it('matches for duplicate headings using unique suffixes', () => {
      const html = createMd().render(`[[toc]]

## Section

## Section

## Section
`);
      const ids = extractHeadingIds(html);
      const hrefs = extractTocHrefs(html);

      expect(ids).toHaveLength(3);
      expect(new Set(ids).size).toBe(3);
      expect(ids).toEqual(hrefs);
    });
  });

  describe('h1 exclusion from TOC', () => {
    it('excludes h1 headings from the TOC', () => {
      const md = createMd();
      const input = `[[toc]]

# Top Level Title

## Section
`;

      const html = md.render(input);
      const tocStart = html.indexOf('<div class="table-of-contents">');
      const tocEnd = html.indexOf('</div>', tocStart) + '</div>'.length;
      const tocHtml = html.substring(tocStart, tocEnd);

      expect(tocHtml).not.toContain('Top Level Title');
      expect(tocHtml).toContain('Section');
    });

    it('does not add an id attribute to h1 headings', () => {
      const md = createMd();
      const input = `# Only H1 Heading\n`;

      const html = md.render(input);

      expect(html).not.toMatch(/id="only-h1-heading"/);
    });

    it('produces an empty TOC when only h1 headings are present', () => {
      const md = createMd();
      const input = `[[toc]]

# Title One

# Title Two
`;

      const html = md.render(input);
      const tocStart = html.indexOf('<div class="table-of-contents">');
      const tocEnd = html.indexOf('</div>', tocStart) + '</div>'.length;
      const tocHtml = html.substring(tocStart, tocEnd);

      expect(tocHtml).not.toContain('<li>');
    });
  });

  describe('[[toc]] placeholder injection after frontmatter', () => {
    it('inserts [[toc]] immediately after the closing --- of frontmatter', () => {
      const articleMd = '---\ntitle: Test\ndate: 01-01-2026\ntags: []\n---\n\n## Heading';
      const articleMdWithToc = articleMd.replace(/^(---[\s\S]*?---\n)/, '$1\n[[toc]]\n\n');

      expect(articleMdWithToc).toMatch(/---\n\n\[\[toc\]\]/);
    });

    it('places [[toc]] before body content', () => {
      const articleMd = '---\ntitle: Test\ndate: 01-01-2026\ntags: []\n---\n\n## Body';
      const articleMdWithToc = articleMd.replace(/^(---[\s\S]*?---\n)/, '$1\n[[toc]]\n\n');
      const tocIndex = articleMdWithToc.indexOf('[[toc]]');
      const bodyIndex = articleMdWithToc.indexOf('## Body');

      expect(tocIndex).toBeGreaterThanOrEqual(0);
      expect(tocIndex).toBeLessThan(bodyIndex);
    });

    it('preserves the original frontmatter content', () => {
      const articleMd =
        '---\ntitle: My Article\ndate: 15-06-2026\ntags:\n  - typescript\n---\n\n## Section';
      const articleMdWithToc = articleMd.replace(/^(---[\s\S]*?---\n)/, '$1\n[[toc]]\n\n');

      expect(articleMdWithToc).toContain('title: My Article');
      expect(articleMdWithToc).toContain('date: 15-06-2026');
      expect(articleMdWithToc).toContain('tags:');
    });

    it('renders [[toc]] into a TOC after injection and markdown parsing', () => {
      const md = createMd();
      const articleMd = '---\ntitle: Test\ndate: 01-01-2026\ntags: []\n---\n\n## Heading';
      const articleMdWithToc = articleMd.replace(/^(---[\s\S]*?---\n)/, '$1\n[[toc]]\n\n');
      const html = md.render(articleMdWithToc);

      expect(html).toContain('Heading');
      expect(html).toContain('href="#heading"');
    });
  });

  describe('slugify', () => {
    it('lowercases the input', () => {
      expect(slugify('Hello World')).toBe('hello-world');
    });

    it('replaces spaces with hyphens', () => {
      expect(slugify('foo bar baz')).toBe('foo-bar-baz');
    });

    it('collapses multiple spaces into a single hyphen', () => {
      expect(slugify('foo  bar')).toBe('foo-bar');
    });

    it('strips colons', () => {
      expect(slugify('Step 1: Setup')).toBe('step-1-setup');
    });

    it('strips parentheses', () => {
      expect(slugify('Mount (using gparted)')).toBe('mount-using-gparted');
    });

    it('strips commas', () => {
      expect(slugify('Foo, Bar')).toBe('foo-bar');
    });

    it('strips apostrophes', () => {
      expect(slugify("pacman's cache")).toBe('pacmans-cache');
    });

    it('strips slashes', () => {
      expect(slugify('mount to /mnt')).toBe('mount-to-mnt');
    });

    it('strips periods', () => {
      expect(slugify('1. Install')).toBe('1-install');
    });

    it('preserves numbers', () => {
      expect(slugify('7.1 Sync')).toBe('71-sync');
    });

    it('preserves existing hyphens', () => {
      expect(slugify('wifi-menu')).toBe('wifi-menu');
    });

    it('trims leading and trailing whitespace', () => {
      expect(slugify('  hello  ')).toBe('hello');
    });

    it('produces no percent-encoded characters', () => {
      expect(slugify('user(name: admin, pass: secret!)')).not.toMatch(/%[0-9A-Fa-f]{2}/);
    });
  });
});

describe('Table of Contents generation', () => {
  describe('TOC HTML structure', () => {
    it('produces a nested <ul> TOC for h2-h6 headings', () => {
      const md = createMd();
      const input = `[[toc]]

## Section One

### Section Two

#### Section Three

##### Section Four

###### Section Five
`;

      const html = md.render(input);

      expect(html).toContain('<ul>');
      expect(html).toContain('<li>');
      expect(html).toContain('Section One');
      expect(html).toContain('Section Two');
      expect(html).toContain('Section Three');
      expect(html).toContain('Section Four');
      expect(html).toContain('Section Five');
    });

    it('produces nested lists reflecting heading hierarchy', () => {
      const md = createMd();
      const input = `[[toc]]

## Level Two

### Level Three
`;

      const html = md.render(input);
      const tocStart = html.indexOf('<div class="table-of-contents">');
      const tocEnd = html.indexOf('</div>', tocStart) + '</div>'.length;
      const tocHtml = html.substring(tocStart, tocEnd);

      expect(tocHtml).toContain('<ul>');
      expect(tocHtml).toContain('Level Two');
      expect(tocHtml).toContain('Level Three');

      const firstUlPos = tocHtml.indexOf('<ul>');
      const innerUlPos = tocHtml.indexOf('<ul>', firstUlPos + 1);

      expect(innerUlPos).toBeGreaterThan(firstUlPos);
    });
  });

  describe('Heading anchor IDs and TOC href matching', () => {
    it('gives h2 headings an id attribute that matches the TOC link href', () => {
      const md = createMd();
      const input = `[[toc]]

## My Heading
`;

      const html = md.render(input);

      expect(html).toMatch(/id="my-heading"/);
      expect(html).toMatch(/href="#my-heading"/);
    });

    it('gives h3 headings an id attribute that matches the TOC link href', () => {
      const md = createMd();
      const input = `[[toc]]

## Parent

### Child Heading
`;

      const html = md.render(input);

      expect(html).toMatch(/id="child-heading"/);
      expect(html).toMatch(/href="#child-heading"/);
    });

    it('gives h6 headings an id attribute that matches the TOC link href', () => {
      const md = createMd();
      const input = `[[toc]]

## Top

###### Deep Heading
`;

      const html = md.render(input);

      expect(html).toMatch(/id="deep-heading"/);
      expect(html).toMatch(/href="#deep-heading"/);
    });
  });

  describe('h1 exclusion from TOC', () => {
    it('excludes h1 headings from the TOC', () => {
      const md = createMd();
      const input = `[[toc]]

# Top Level Title

## Section
`;

      const html = md.render(input);
      const tocStart = html.indexOf('<div class="table-of-contents">');
      const tocEnd = html.indexOf('</div>', tocStart) + '</div>'.length;
      const tocHtml = html.substring(tocStart, tocEnd);

      expect(tocHtml).not.toContain('Top Level Title');
      expect(tocHtml).toContain('Section');
    });

    it('does not add an id attribute to h1 headings', () => {
      const md = createMd();
      const input = `# Only H1 Heading
`;

      const html = md.render(input);

      expect(html).not.toMatch(/id="only-h1-heading"/);
    });

    it('produces an empty TOC when only h1 headings are present', () => {
      const md = createMd();
      const input = `[[toc]]

# Title One

# Title Two
`;

      const html = md.render(input);
      const tocStart = html.indexOf('<div class="table-of-contents">');
      const tocEnd = html.indexOf('</div>', tocStart) + '</div>'.length;
      const tocHtml = html.substring(tocStart, tocEnd);

      expect(tocHtml).not.toContain('<li>');
    });
  });

  describe('[[toc]] placeholder injection after frontmatter', () => {
    it('inserts [[toc]] immediately after the closing --- of frontmatter', () => {
      const articleMd = '---\ntitle: Test\ndate: 01-01-2026\ntags: []\n---\n\n## Heading';
      const articleMdWithToc = articleMd.replace(/^(---[\s\S]*?---\n)/, '$1\n[[toc]]\n\n');

      expect(articleMdWithToc).toMatch(/---\n\n\[\[toc\]\]/);
    });

    it('places [[toc]] before body content', () => {
      const articleMd = '---\ntitle: Test\ndate: 01-01-2026\ntags: []\n---\n\n## Body';
      const articleMdWithToc = articleMd.replace(/^(---[\s\S]*?---\n)/, '$1\n[[toc]]\n\n');
      const tocIndex = articleMdWithToc.indexOf('[[toc]]');
      const bodyIndex = articleMdWithToc.indexOf('## Body');

      expect(tocIndex).toBeGreaterThanOrEqual(0);
      expect(tocIndex).toBeLessThan(bodyIndex);
    });

    it('preserves the original frontmatter content', () => {
      const articleMd =
        '---\ntitle: My Article\ndate: 15-06-2026\ntags:\n  - typescript\n---\n\n## Section';
      const articleMdWithToc = articleMd.replace(/^(---[\s\S]*?---\n)/, '$1\n[[toc]]\n\n');

      expect(articleMdWithToc).toContain('title: My Article');
      expect(articleMdWithToc).toContain('date: 15-06-2026');
      expect(articleMdWithToc).toContain('tags:');
    });

    it('renders [[toc]] into a TOC after injection and markdown parsing', () => {
      const md = createMd();
      const articleMd = '---\ntitle: Test\ndate: 01-01-2026\ntags: []\n---\n\n## Heading';
      const articleMdWithToc = articleMd.replace(/^(---[\s\S]*?---\n)/, '$1\n[[toc]]\n\n');
      const html = md.render(articleMdWithToc);

      expect(html).toContain('Heading');
      expect(html).toContain('href="#heading"');
    });
  });
});
