import path, { dirname } from 'path';
import assert from 'yeoman-assert';
import helpers from 'yeoman-test';

import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

describe('@mshima/json:app', () => {
  let ctx;

  beforeEach(() => {
    ctx = helpers
      .create('@mshima/json:app', {}, { experimental: true })
      .withLookups([{ npmPaths: path.join(__dirname, '..', '..'), registerToScope: 'mshima' }]);
  });

  afterEach(() => {
    ctx.cleanTestDirectory();
  });

  describe('with sample values', () => {
    const fileName = 'test.json';

    beforeEach(() => {
      return ctx
        .withOptions({
          empty: true,
        })
        .withArguments([fileName])
        .run();
    });

    it('it works', () => {
      assert.file(path.join(ctx.targetDirectory, fileName));
    });
  });
});
