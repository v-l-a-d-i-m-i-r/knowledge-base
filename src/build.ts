import { promises as fs } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

import hljs from 'highlight.js';
import markdownIt from 'markdown-it';
import anchor from 'markdown-it-anchor';
import HighlightJS from 'markdown-it-highlightjs';
import metadata_block from 'markdown-it-metadata-block';
import toc from 'markdown-it-table-of-contents';
import * as sass from 'sass';
import { Logger } from 'tslog';
import yaml from 'yaml';

import { ArticleMeta, articleMetaSchema } from './common/article-meta';
import { renderArticlePage } from './renderers/article-page.renderer';
import { renderHomePage } from './renderers/home-page.renderer';
import { calcMd5Hash } from './utils';
import { addBuildIdToFilePath } from './utils/add-build-id-to-file-path';
import { fileCache } from './utils/cache';
import { generateRandomString } from './utils/generate-random-string';
import { calculateReadTime } from './utils/reading-time';
import { slugify } from './utils/slugify';

const log = new Logger();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const ARTICLES_PATH = path.join(__dirname, './articles');
const BUILD_PATH = path.join(__dirname, '../dist');
const CSS_SRC_PATH = path.join(__dirname, './css');
const CSS_DIST_PATH = path.join(BUILD_PATH, './css');
const SCSS_SRC_PATH = path.join(__dirname, './scss');
const JS_SRC_PATH = path.join(__dirname, './js');
const JS_DIST_PATH = path.join(BUILD_PATH, './js');
const BUILD_ID = process.env.NODE_ENV === 'production' ? generateRandomString(8) : 'dev';

async function checkFolderExists(dir: string): Promise<boolean> {
  try {
    await fs.stat(dir);
    return true;
  } catch (error) {
    return false;
  }
}

async function createFolderIfNotExists(dir: string): Promise<void> {
  const exists = await checkFolderExists(dir);

  if (exists) {
    return;
  }

  await fs.mkdir(dir);
}

async function listFiles(dir: string): Promise<string[]> {
  const entries = await fs.readdir(dir, { withFileTypes: true });

  return entries.filter((entry) => !entry.isDirectory()).map((entry) => entry.name);
}

async function buildPages() {
  const articleFileNames = await listFiles(ARTICLES_PATH);
  const articleMetadata: Array<{ fileName: string; title: string }> = [];

  const articlePagePromises = articleFileNames.map(async (articleFileName) => {
    const articleMdPath = path.join(ARTICLES_PATH, articleFileName);
    const articleMd = await fs.readFile(articleMdPath, 'utf8');
    const metaData = {} as ArticleMeta;

    const md = markdownIt();
    md.use(metadata_block, {
      parseMetadata: yaml.parse,
      meta: metaData,
    });
    md.use(HighlightJS, { hljs });
    md.use(anchor, {
      level: 2,
      slugify,
      permalink: anchor.permalink.headerLink(),
      tabIndex: -1,
    });
    md.use(toc, { includeLevel: [2, 3, 4, 5, 6], slugify });

    const articleMdWithToc = articleMd.replace(/^(---[\s\S]*?---\n)/, '$1\n[[toc]]\n\n');
    const articleContentHtml = md.render(articleMdWithToc);

    const validatedMeta = articleMetaSchema.parse({
      title: metaData.title,
      date: metaData.date,
      tags: metaData.tags,
    });

    const articlePageHtml = renderArticlePage({
      buildId: BUILD_ID,
      article: articleContentHtml,
      tags: validatedMeta.tags,
      date: validatedMeta.date,
      readTime: calculateReadTime(articleMd),
    });
    const aticleHtmlPath = path.join(BUILD_PATH, articleFileName.replace('md', 'html'));
    await fs.writeFile(aticleHtmlPath, articlePageHtml);

    articleMetadata.push({
      fileName: articleFileName.replace('md', 'html'),
      title: validatedMeta.title,
    });
  });

  await Promise.all(articlePagePromises);

  const links = articleMetadata.map((item) => ({
    href: item.fileName,
    label: item.title,
  }));
  const indexPageHtml = renderHomePage({ links, buildId: BUILD_ID });
  const indexPageHtmlPath = path.join(BUILD_PATH, 'index.html');

  await fs.writeFile(indexPageHtmlPath, indexPageHtml);
}

async function buildCss(srcPath: string, distPath: string, buildPath: string): Promise<void> {
  const cssFileNames = await listFiles(srcPath);

  const cssPromises = cssFileNames.map(async (cssFileName) => {
    const fileSrcPath = path.join(srcPath, cssFileName);
    const fileContent = await fs.readFile(fileSrcPath, 'utf8');
    const md5Hash = calcMd5Hash(fileContent);
    const fileDistPath = path.join(
      distPath,
      addBuildIdToFilePath({
        buildId: BUILD_ID,
        fileExt: '.css',
        filePath: cssFileName,
      }),
    );

    await fs.writeFile(fileDistPath, fileContent);

    const key = path.join('/', path.relative(buildPath, distPath), cssFileName);

    fileCache.set(key, { content: fileContent, md5: md5Hash });
  });

  await Promise.all(cssPromises);
}

async function buildScss(srcPath: string, distPath: string, buildPath: string): Promise<void> {
  const scssFileNames = await listFiles(srcPath);

  const cssPromises = scssFileNames
    .filter((filename) => !filename.startsWith('_'))
    .map(async (scssFileName) => {
      const fileSrcPath = path.join(srcPath, scssFileName);
      const fileContent = (await sass.compileAsync(fileSrcPath)).css;
      const md5Hash = calcMd5Hash(fileContent);
      const cssFileName = scssFileName.replace('scss', 'css');
      const fileDistPath = path.join(
        distPath,
        addBuildIdToFilePath({
          buildId: BUILD_ID,
          fileExt: '.css',
          filePath: cssFileName,
        }),
      );

      await fs.writeFile(fileDistPath, fileContent);

      const key = path.join('/', path.relative(buildPath, distPath), cssFileName);

      fileCache.set(key, { content: fileContent, md5: md5Hash });
    });

  await Promise.all(cssPromises);
}

async function buildJs(srcPath: string, distPath: string, buildPath: string): Promise<void> {
  const jsFileNames = await listFiles(srcPath);

  const jsPromises = jsFileNames.map(async (jsFileName) => {
    const fileSrcPath = path.join(srcPath, jsFileName);
    const fileContent = await fs.readFile(fileSrcPath, 'utf8');
    const md5Hash = calcMd5Hash(fileContent);
    const fileDistPath = path.join(
      distPath,
      addBuildIdToFilePath({
        buildId: BUILD_ID,
        fileExt: '.js',
        filePath: jsFileName,
      }),
    );

    await fs.writeFile(fileDistPath, fileContent);

    const key = path.join('/', path.relative(buildPath, distPath), jsFileName);

    fileCache.set(key, { content: fileContent, md5: md5Hash });
  });

  await Promise.all(jsPromises);
}

async function build() {
  fileCache.clear();
  await createFolderIfNotExists(BUILD_PATH);
  await createFolderIfNotExists(CSS_DIST_PATH);
  await createFolderIfNotExists(JS_DIST_PATH);
  await buildScss(SCSS_SRC_PATH, CSS_DIST_PATH, BUILD_PATH);
  await buildCss(CSS_SRC_PATH, CSS_DIST_PATH, BUILD_PATH);
  await buildJs(JS_SRC_PATH, JS_DIST_PATH, BUILD_PATH);
  await buildPages();
}

const buidStart = Date.now();
build()
  .then(() => {
    const buildEnd = Date.now();
    const buildTime = (buildEnd - buidStart) / 1000; // sec
    log.info(`Build done in ${buildTime} sec.`);
    process.exit(0);
  })
  .catch((error) => {
    log.error('Build failed', error);
    process.exit(1);
  });
