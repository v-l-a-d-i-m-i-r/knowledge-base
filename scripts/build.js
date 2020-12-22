const Generator = require('../generator/src/index');

const destination = '../build';

(async () => {
  try {
    const generator = Generator(__dirname, {
      pages: {
        source: '../src/pages',
        destination,
        layout: {
          default: 'index.ejs',
          directory: '../src/layouts/pages',
        },
        clean: true,
      },
      assets: {
        source: '../src/assets',
        destination: `${destination}/assets`,
      }
    });

    await generator.build();

    process.exit(0);
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
})();