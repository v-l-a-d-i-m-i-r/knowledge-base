import { renderArticlePage } from '../src/renderers/article-page.renderer';

function makeProps(overrides: Partial<Parameters<typeof renderArticlePage>[0]> = {}) {
  return {
    buildId: 'test-build',
    tags: ['typescript', 'node'],
    article: '<p>Body content</p>',
    date: '01-01-2026',
    readTime: '3 min read',
    ...overrides,
  };
}

describe('renderArticlePage', () => {
  it('renders the article-read-time element with the readTime value', () => {
    const html = renderArticlePage(makeProps({ readTime: '5 min read' }));
    expect(html).toContain('<div class="article-read-time">5 min read</div>');
  });

  it('renders date before read-time before tags', () => {
    const html = renderArticlePage(makeProps());

    const dateIndex = html.indexOf('article-date');
    const readTimeIndex = html.indexOf('article-read-time');
    const tagsIndex = html.indexOf('article-tags');

    expect(dateIndex).toBeLessThan(readTimeIndex);
    expect(readTimeIndex).toBeLessThan(tagsIndex);
  });

  it('renders date element', () => {
    const html = renderArticlePage(makeProps({ date: '15-06-2025' }));
    expect(html).toContain('<div class="article-date">Published: 15-06-2025</div>');
  });

  it('renders tags element', () => {
    const html = renderArticlePage(makeProps({ tags: ['foo', 'bar'] }));
    expect(html).toContain('<span class="tag">foo</span>');
    expect(html).toContain('<span class="tag">bar</span>');
  });
});
