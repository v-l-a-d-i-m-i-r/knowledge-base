import { renderCss } from './css-file.renderer';
import { renderFooter } from './footer.renderer';
import { renderHeader } from './header.renderer';
import { renderJs } from './js-file.renderer';
import { ArticlePageProperties } from '../common/article-page-properties';

export function renderArticlePage(props: ArticlePageProperties): string {
  const buildId = props.buildId;
  const tags = props.tags || [];
  const article = props.article;
  const date = props.date;

  const tagsHtml =
    tags.length > 0
      ? `<div class="article-tags">${tags.map((tag) => `<span class="tag">${tag}</span>`).join('')}</div>`
      : '';

  const dateHtml = `<div class="article-date">Published: ${date}</div>`;
  const readTime = props.readTime;
  const readTimeHtml = `<div class="article-read-time">${readTime}</div>`;

  return `
  <!doctype html>
  <html lang="en">
    <head>
      <meta charset="utf-8" />
      <title>You Know</title>
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
      <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
      <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
      <link rel="manifest" href="/site.webmanifest" />
      <link
        href="https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;500&display=swap"
        rel="stylesheet" />
      <link
        href="https://fonts.googleapis.com/css2?family=Roboto+Mono&display=swap"
        rel="stylesheet" />
      <link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet" />
      ${renderCss({ path: '/css/style.css', buildId })}
      ${renderCss({ path: '/css/header.css', buildId })}
      ${renderCss({ path: '/css/footer.css', buildId })}
    </head>
    <body>
      <div class="layout-header">
        ${renderHeader()}
      </div>

      <div class="layout-body">
        <main class="layout-content">
          <div class="wrapper">
            ${dateHtml}
            ${readTimeHtml}
            ${tagsHtml}
            ${article}
          </div>
        </main>
        <div class="layout-footer">
          ${renderFooter()}
        </div>
      </div>

      <!-- eslint-disable-next-line max-len -->
      <script
        src="https://code.jquery.com/jquery-3.7.1.min.js"
        integrity="sha256-/JqT3SQfawRcv/BIHPThkBvs0OEvtFFmqPF/lYI/Cxo="
        crossorigin="anonymous"
      ></script>
      ${renderJs({ path: '/js/index.js', buildId })}
    </body>
  </html>
  `;
}
/* eslint-enable max-len */
