import { calculateReadTime } from '../src/utils/reading-time';

describe('calculateReadTime', () => {
  describe('plain prose', () => {
    it('returns correct reading time for short plain prose', () => {
      const words = Array(200).fill('word').join(' ');
      expect(calculateReadTime(words)).toBe('1 min read');
    });

    it('returns 2 min read for 201 words', () => {
      const words = Array(201).fill('word').join(' ');
      expect(calculateReadTime(words)).toBe('2 min read');
    });

    it('returns 3 min read for 400 words', () => {
      const words = Array(400).fill('word').join(' ');
      expect(calculateReadTime(words)).toBe('2 min read');
    });
  });

  describe('markdown-formatted prose', () => {
    it('strips headings before counting words', () => {
      const md = '## Introduction\n\nThis is a sentence.';
      const plain = 'This is a sentence.';
      expect(calculateReadTime(md)).toBe(calculateReadTime(plain));
    });

    it('strips emphasis markers before counting words', () => {
      const md = '**bold** and _italic_ text here';
      const plain = 'bold and italic text here';
      expect(calculateReadTime(md)).toBe(calculateReadTime(plain));
    });

    it('strips inline code before counting words', () => {
      const md = 'Use `npm install` to install';
      const plain = 'Use npm install to install';
      expect(calculateReadTime(md)).toBe(calculateReadTime(plain));
    });

    it('strips link syntax before counting words', () => {
      const md = 'See [the docs](https://example.com) for details';
      const plain = 'See the docs for details';
      expect(calculateReadTime(md)).toBe(calculateReadTime(plain));
    });

    it('returns correct reading time for markdown-formatted text with headings and emphasis', () => {
      const md = [
        '## Introduction',
        '',
        'This is **bold** and _italic_ text.',
        '',
        '### Sub-section',
        '',
        'More `inline code` and [a link](https://example.com) here.',
      ].join('\n');
      expect(calculateReadTime(md)).toBe('1 min read');
    });
  });

  describe('code-heavy markdown', () => {
    it('excludes fenced code blocks from word count', () => {
      const longCodeBlock = `\`\`\`\n${Array(1000).fill('code').join(' ')}\n\`\`\``;
      const md = `Some prose here.\n\n${longCodeBlock}\n\nMore prose here.`;
      expect(calculateReadTime(md)).toBe('1 min read');
    });

    it('counts prose words outside fenced blocks', () => {
      const proseWords = Array(200).fill('word').join(' ');
      const codeBlock = `\`\`\`\n${Array(500).fill('code').join('\n')}\n\`\`\``;
      const md = `${proseWords}\n\n${codeBlock}`;
      expect(calculateReadTime(md)).toBe('1 min read');
    });
  });

  describe('YAML frontmatter exclusion', () => {
    it('excludes frontmatter from word count', () => {
      const frontmatter =
        '---\ntitle: My Article\ndate: 01-01-2026\ntags:\n  - typescript\n---\n\n';
      const body = 'Short body.';
      expect(calculateReadTime(frontmatter + body)).toBe('1 min read');
    });

    it('frontmatter words do not inflate reading time', () => {
      const manyFrontmatterWords = `---\n${Array(500).fill('key: value').join('\n')}\n---\n\n`;
      const body = 'Just a few words here.';
      expect(calculateReadTime(manyFrontmatterWords + body)).toBe('1 min read');
    });
  });

  describe('near-empty input', () => {
    it('returns 1 min read for empty string', () => {
      expect(calculateReadTime('')).toBe('1 min read');
    });

    it('returns 1 min read for only whitespace', () => {
      expect(calculateReadTime('   \n\n  ')).toBe('1 min read');
    });

    it('returns 1 min read for a single word', () => {
      expect(calculateReadTime('Hello')).toBe('1 min read');
    });

    it('returns 1 min read for only frontmatter with no body', () => {
      expect(calculateReadTime('---\ntitle: Empty\n---\n')).toBe('1 min read');
    });

    it('returns 1 min read for only a fenced code block', () => {
      expect(calculateReadTime('```\nconst x = 1;\n```')).toBe('1 min read');
    });
  });

  describe('rounding', () => {
    it('rounds up to the next minute', () => {
      const words = Array(201).fill('word').join(' ');
      expect(calculateReadTime(words)).toBe('2 min read');
    });

    it('does not round up exact multiples', () => {
      const words = Array(400).fill('word').join(' ');
      expect(calculateReadTime(words)).toBe('2 min read');
    });
  });
});
