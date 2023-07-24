const removeCodeBlocks = string => string.replace(/`{3}((.|[\r\n])*?)`{3}/gm, '');

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
    const defaultId = string.replace(/[\s\(\)\.]*/g, '').toLowerCase();

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

  return headerObjects.map(
    ([_, hashes, text]) => {
      const title = text.trim();
      const id = buildIdFromTitle(title);

      return {
        level: hashes.length,
        title,
        id,
      };
    }
  );
};

const groupHeaders = (items) => {
  const groups = [];

  if (!items.length) {
    return groups;
  }

  const firstItemLevel = items[0].level;

  for (let itemIndex = 0, groupIndex = -1; itemIndex < items.length; itemIndex++) {
    const item = items[itemIndex];

    if (item.level <= firstItemLevel) {
      groups.push(item);
      groupIndex++;

      continue;
    }

    const group = groups[groupIndex];
    const children = group.children || [];
    children.push(item);
    group.children = children;
  }

  return groups.map(group => group.children ? { ...group, children: groupHeaders(group.children) } : group);
}

module.exports = (mdString = '') => {
  const contentStringWithoutCodeBlocks = removeCodeBlocks(mdString);
  const headersObjects = getHeaders(contentStringWithoutCodeBlocks);
  const mappedHeaders = mapHeaders(headersObjects);
  return groupHeaders(mappedHeaders);
};
