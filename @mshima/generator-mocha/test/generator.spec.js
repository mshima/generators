const path = require('path');
const assert = require('yeoman-assert');
const helpers = require('yeoman-test');

describe('@mshima/mocha:generator', () => {
  let ctx;

  beforeEach(() => {
    ctx = helpers
      .create(
        '@mshima/mocha:generator#app',
        {},
        {experimental: true}
      )
      .withLookups([
        {npmPaths: path.join(__dirname, '..', '..')}
      ])
      .withLocalConfig({
        packageNamespace: 'foo'
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
