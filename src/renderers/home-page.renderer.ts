import { renderCss } from './css-file.renderer';
import { renderFooter } from './footer.renderer';
import { renderHeader } from './header.renderer';
import { HomePageProperties } from '../common/home-page-properties';

export function renderHomePage(props: HomePageProperties): string {
  const buildId = props.buildId;
  const links = props.links;
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
          <section class="toc">
            <div class="wrapper">
              ${links.map((link) => `<a href="${link.href}">${link.label}</a> <br/>`).join('')}
            </div>
          </section>
        </main>
        <div class="layout-footer">
          ${renderFooter()}
        </div>
      </div>
    </body>
  </html>
  `;
}
