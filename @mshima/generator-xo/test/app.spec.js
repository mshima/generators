const path = require('path');
const assert = require('yeoman-assert');
const helpers = require('yeoman-test');

describe('@mshima/xo:app', () => {
  let ctx;

  beforeEach(() => {
    ctx = helpers
      .create(
        '@mshima/xo:app',
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
    it('writes .xo-config.json', () => {
      assert.file(path.join(ctx.targetDirectory, '.xo-config.json'));
    });
  });
});
