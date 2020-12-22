const fs = require('fs');
const path = require('path');
const ejs = require('ejs');
const R = require('ramda');
const showdown = require('showdown');
const buildToc = require('./toc');

const converter = new showdown.Converter();

module.exports = ({ default: defaultLayout, directory }) => (files, metalsmith, done) => {
  setImmediate(done);

  const dirName = metalsmith._directory;
  const layoutPath = path.join(dirName, directory, defaultLayout);
  const layout = fs.readFileSync(layoutPath).toString('utf-8');

  for (const [fileName, fileData] of Object.entries(files)) {
    const contents = ejs.render(
      layout,
      {
        title: 'Default titile',
        contents: converter.makeHtml(fileData.contents.toString('utf-8')),
        toc: buildToc(fileData.contents)
      },
      { filename: layoutPath }
    );

    const newFileName = fileName.replace('.md', '.html');
    const newFileData = {...fileData, contents };

    delete files[fileName];

    files[newFileName] = newFileData;
  }
}