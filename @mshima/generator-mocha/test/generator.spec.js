import path, { dirname } from 'path';
import assert from 'yeoman-assert';
import helpers from 'yeoman-test';

import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

describe('@mshima/mocha:generator', () => {
  let ctx;

  beforeEach(() => {
    ctx = helpers
      .create('@mshima/mocha:generator#app', {}, { experimental: true })
      .withLookups([{ npmPaths: path.join(__dirname, '..', '..') }])
      .withLocalConfig({
        packageNamespace: 'foo',
      })
      .withArguments(['app'])
      .build();
  });

  afterEach(() => {
    ctx.cleanTestDirectory();
  });

  describe('generator', () => {
    beforeEach(() => {
      return ctx.run();
    });

    it('writes test/app.spec.js file', () => {
      assert.file(path.join(ctx.targetDirectory, 'test/app.spec.js'));
    });
  });
});
