import path, { dirname } from 'path';
import assert from 'yeoman-assert';
import helpers from 'yeoman-test';

import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

describe('@mshima/github:ci-workflow', () => {
  let ctx;

  beforeEach(() => {
    ctx = helpers
      .create('@mshima/github:ci-workflow')
      .withArguments(['node.js'])
      .withLookups([{ npmPaths: path.join(__dirname, '..', '..') }])
      .build();
  });

  afterEach(() => {
    ctx.cleanTestDirectory();
  });

  describe('with sample values', () => {
    beforeEach(() => {
      return ctx.run();
    });

    it("doesn't fails", () => {
      assert(true);
    });
    it('writes .github/workflows/test.yml', () => {
      assert.file(path.join(ctx.targetDirectory, '.github/workflows/node.js.yml'));
    });
  });
});
