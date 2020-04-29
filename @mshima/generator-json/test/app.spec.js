const path = require('path');
const assert = require('yeoman-assert');
const helpers = require('yeoman-test');

describe('@mshima/json:app', () => {
  let ctx;

  beforeEach(() => {
    ctx = helpers
      .create(
        '@mshima/json:app',
        {},
        {experimental: true}
      )
      .withLookups([
        {npmPaths: path.join(__dirname, '..', '..'), registerToScope: 'mshima'}
      ]);
  });

  afterEach(() => {
    ctx.cleanTestDirectory();
  });

  describe('with sample values', () => {
    const fileName = 'test.json';

    beforeEach(() => {
      return ctx.withOptions({
        empty: true
      }).withArguments([fileName]).run();
    });

    it('it works', () => {
      assert.file(path.join(ctx.targetDirectory, fileName));
    });
  });
});
