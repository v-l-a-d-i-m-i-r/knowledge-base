const path = require('path');
const { src, dest, series, parallel, watch } = require('gulp');
const rimraf = require('rimraf');
const sass = require('gulp-sass')(require('sass'));
const sourcemaps = require('gulp-sourcemaps');
const render = require('./render.gulp');
const rename = require('gulp-rename');
const sync = require('browser-sync');

const source = './src';
const destination = './build';

const config = {
  assets: {
    srcGlob: `${source}/assets/**`,
    destGlob: `${destination}/assets/`,
  },
  scss: {
    srcGlob: `${source}/scss/**`,
    destGlob: `${destination}/css/`,
  },
  js: {
    srcGlob: `${source}/js/**`,
    destGlob: `${destination}/js`,
  },
  pages: {
    srcGlob: `${source}/pages/**/*.md`,
  },
  templates: {
    srcPath: path.join(__dirname, source, 'templates/pages'),
  }
};

const assets = () => src(config.assets.srcGlob)
  .pipe(dest(config.assets.destGlob));

const scss = () => src(config.scss.srcGlob)
  .pipe(sourcemaps.init())
  .pipe(sass().on('error', sass.logError))
  .pipe(sourcemaps.write())
  .pipe(dest(config.scss.destGlob));

const js = () => src(config.js.srcGlob)
  .pipe(dest(config.js.destGlob));

const clear = (cb) => {
  rimraf.sync(destination);
  cb();
};

const md = () => src(config.pages.srcGlob)
  .pipe(render({
    templatesPath: config.templates.srcPath,
    defaultTemplate: 'index.ejs',
  }))
  .pipe(rename({
    extname: '.html',
  }))
  .pipe(dest(destination));

const build = parallel(scss, assets, js, md);
const serve = () => {
  sync.init({
    server: destination,
    open: false,
  });

  watch(config.assets.srcGlob, assets).on('change', sync.reload);
  watch(config.scss.srcGlob, scss).on('change', sync.reload);
  watch(config.js.srcGlob, js).on('change', sync.reload);
  watch(config.pages.srcGlob, md).on('change', sync.reload);
  watch(config.templates.srcPath, md).on('change', sync.reload);
}

exports.build = series(clear, build);
exports.serve = series(clear, build,serve);
