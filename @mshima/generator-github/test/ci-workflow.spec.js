const path = require('path');
const assert = require('yeoman-assert');
const helpers = require('yeoman-test');

describe('@mshima/github:ci-workflow', () => {
  let ctx;

  beforeEach(() => {
    ctx = helpers
      .create(
        '@mshima/github:ci-workflow',
        {},
        {experimental: true}
      )
      .withLookups([
        {npmPaths: path.join(__dirname, '..', '..')}
      ])
      .build();
  });

  afterEach(() => {
    ctx.cleanTestDirectory();
  });

  describe('with sample values', () => {
    beforeEach(() => {
      return ctx.run();
    });

    it('doesn\'t fails', () => {
      assert(true);
    });
    it('writes .github/workflows/test.yml', () => {
      assert.file(path.join(ctx.targetDirectory, '.github/workflows/test.yml'));
    });
  });
});
