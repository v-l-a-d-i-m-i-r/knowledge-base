export default {
  '*.{js,json,css,scss,md}': 'prettier --write',
  '*.{ts}': ['eslint --fix', 'prettier --write'],
  '*.{scss,css}': 'stylelint --fix',
};
