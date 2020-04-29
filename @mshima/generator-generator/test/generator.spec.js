const path = require('path');
const assert = require('yeoman-assert');
const helpers = require('yeoman-test');
const {createEnv} = require('yeoman-environment');

describe('@mshima/generator:generator', () => {
  let ctx;

  beforeEach(() => {
    ctx = helpers
      .create(
        '@mshima/generator:generator#app',
        {},
        {experimental: true, createEnv}
      )
      .withLookups([
        {npmPaths: path.join(__dirname, '..', '..')}
      ])
      .withArguments(['app'])
      .build();
  });

  afterEach(() => {
    ctx.cleanTestDirectory();
  });

  describe('Default test', () => {
    beforeEach(() => {
      return ctx.run();
    });

    it('writes app generator file', () => {
      assert.file(path.join(ctx.targetDirectory, 'generators/app/index.js'));
    });
  });
});
