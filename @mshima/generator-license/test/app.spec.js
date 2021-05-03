import path, { dirname } from 'path';
import assert from 'yeoman-assert';
import helpers from 'yeoman-test';

import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

describe('license:app', () => {
  let ctx;

  beforeEach(() => {
    ctx = helpers
      .create('@mshima/license:app', {}, { experimental: true })
      .withLookups([{ npmPaths: path.join(__dirname, '..', '..') }]);
  });

  afterEach(() => {
    ctx.cleanTestDirectory();
  });

  it('with author prompts: --name --email --website', () => {
    return ctx
      .withPrompts({
        license: 'ISC',
        name: 'Rick',
        email: 'foo@example.com',
        url: 'http://example.com',
      })
      .run()
      .then(() => {
        assert.fileContent('LICENSE', 'ISC');
        assert.fileContent('LICENSE', 'Rick <foo@example.com> (http://example.com)');
      });
  });

  it('--output change the destination directory', () => {
    return ctx
      .withOptions({
        output: 'src/license.txt',
      })
      .withPrompts({
        name: 'Rick',
        email: 'foo@example.com',
        year: '2015',
        website: 'http://example.com',
        license: 'GPL-3.0',
      })
      .run()
      .then(() => {
        assert.file('src/license.txt');
        assert.noFile('LICENSE');
      });
  });
});
