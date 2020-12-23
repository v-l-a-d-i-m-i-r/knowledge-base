const fs = require('fs');
const path = require('path');
const toc = require('../src/toc');

const readFile = filePath => fs.readFileSync(path.resolve(__dirname, filePath)).toString('utf-8');

describe('toc tests', () => {
  test('', () => {
    const content = readFile('./fixtures/simple-nested-headers-tree.md');

    expect(toc(content)).toEqual([
      {
        id: 'h11',
        title: 'H1 1',
        level: 1,
        children: [
          {
            id: 'h21',
            title: 'H2 1',
            level: 2,
            children: [
              {
                id: 'h31',
                title: 'H3 1',
                level: 3,
                children: [
                  {
                    id: 'h41',
                    title: 'H4 1',
                    level: 4,
                    children: [
                      {
                        id: 'h51',
                        title: 'H5 1',
                        level: 5,
                        children: [
                          {
                            id: 'h61',
                            title: 'H6 1',
                            level: 6
                          }
                        ]
                      }
                    ]
                  }
                ]
              }
            ]
          }
        ],
      }
    ]);
  });
});