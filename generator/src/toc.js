const R = require('ramda');

const getHeaders = mdString => {
  const regex = /^(#+)(.*)$/gm;
  const result = [];
  let match;

  while (match = regex.exec(mdString)) {
    result.push(match);
  }

  return result;
};

const buildId = () => {
  const idHash = {};

  return string => {
    const defaultId = R.pipe(R.replace(/[\s\(\)\.]*/g, ''), R.toLower)(string);

    if (!idHash[defaultId]) {
      idHash[defaultId] = true;

      return defaultId;
    }

    let i = 0;
    let id = '';

    do {
      i = i + 1;
      id = `${defaultId}-${i}`;

      if (!idHash[id]) {
        idHash[id] = true;

        return id;
      }
    } while (true)
  }
};

const mapHeaders = headerObjects => {
  const buildIdFromTitle = buildId();

  return R.map(
    ([_, hashes, text]) => {
      const title = R.trim(text);
      const id = buildIdFromTitle(title);

      return {
        level: hashes.length,
        title,
        id,
      };
    }
  )(headerObjects);
};

const buildTree = (items, level = 1) => items
  .reduce((acc, item, index) => (item.level === level ? [...acc, { item, index}] : acc), [])
  .map((itemInLevel, indexInLevel, levelItems) => {
    const nextItemInLevel = levelItems[indexInLevel + 1];
    const children = items.slice(itemInLevel.index + 1, nextItemInLevel && nextItemInLevel.index);

    return children.length
      ? { ...itemInLevel.item, children: buildTree(children, level + 1) }
      : { ...itemInLevel.item };
  });

module.exports = R.pipe(R.defaultTo(''), getHeaders, mapHeaders, buildTree);
