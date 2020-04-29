const path = require('path');
const assert = require('yeoman-assert');
const helpers = require('yeoman-test');

describe('@mshima/node-package:app', () => {
  let ctx;

  beforeEach(() => {
    ctx = helpers
      .create(
        '@mshima/node-package:app',
        {},
        {experimental: true}
      )
      .withOptions({
        disableLicense: true
      })
      .withPrompts({
        name: 'generator-test'
      })
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

    it('writes package.json file', () => {
      assert.file(path.join(ctx.targetDirectory, 'package.json'));
    });

    it('writes README.md file', () => {
      assert.file(path.join(ctx.targetDirectory, 'README.md'));
    });

    it('writes .gitignore file', () => {
      assert.file(path.join(ctx.targetDirectory, '.gitignore'));
    });

    it('writes .xo-config.json file', () => {
      assert.file(path.join(ctx.targetDirectory, '.xo-config.json'));
    });

    it('writes generators/app/index.js file', () => {
      assert.file(path.join(ctx.targetDirectory, 'generators/app/index.js'));
    });
  });
});
