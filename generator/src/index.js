const Metalsmith = require('metalsmith');
const htmlMinifier = require("metalsmith-html-minifier");
const sass = require('metalsmith-sass');
const pageBuilder = require('./page-builder');

const MetalsmithAsync = dirName => {
  const metalsmith = Metalsmith(dirName);

  metalsmith.buildAsync = function() {
    return new Promise((resolve, reject) => {
      this.build(error => {
        error ? reject(error) : resolve();
      });
    })
  }

  return metalsmith;
}

const buildPages = (dirname, { source, destination, layout } = {}) => {
  const metalsmith = MetalsmithAsync(dirname);

  metalsmith.source(source);
  metalsmith.destination(destination);
  metalsmith.use(pageBuilder(layout));
  metalsmith.use(htmlMinifier());
  metalsmith.clean(true);

  return metalsmith.buildAsync();
};

const buildAssets = async (dirname, { source, destination }) => {
  const metalsmith = MetalsmithAsync(dirname);

  metalsmith.source(source);
  metalsmith.destination(destination);
  metalsmith.use(sass({ outputDir: 'css/' }));
  metalsmith.clean(false);

  return metalsmith.buildAsync();
};

module.exports = (dirname, { pages, assets } = {}) => {
  return {
    build: async () => {
      if (pages) await buildPages(dirname, pages);
      if (assets) await buildAssets(dirname, assets);
    }
  }
};