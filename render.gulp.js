// https://github.com/gulpjs/gulp/blob/master/docs/writing-a-plugin/README.md
const fs = require('fs');
const path = require('path');
const { Transform } = require('stream');
const ejs = require('ejs');
const showdown = require('showdown');
const parseMd = require('parse-md').default;
const buildToc = require('./generator/src/toc.js');

const converter = new showdown.Converter();

module.exports = (params) => new Transform({
  objectMode: true,
  transform(file, encoding, callback) {
    try {
      const fileContentsString = file.contents.toString(encoding);
      const { metadata, content } = parseMd(fileContentsString);
      const layoutPath = path.join(params.templatesPath, params.defaultTemplate);
      const layout = fs.readFileSync(layoutPath).toString('utf-8');

      const contents = ejs.render(
        layout,
        {
          title: 'Default titile',
          contents: converter.makeHtml(fileContentsString),
          toc: buildToc(fileContentsString),
          // toc: [],
        },
        { filename: layoutPath },
      );

      file.contents = Buffer.from(contents);

      callback(null, file);
    } catch (error) {
      callback(error);
    }
  },
})
