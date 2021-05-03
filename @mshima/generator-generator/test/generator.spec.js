const path = require('path');
const assert = require('yeoman-assert');
const helpers = require('yeoman-test');

describe('@mshima/generator:generator', () => {
  let runContext;
  let runResult;

  beforeEach(async () => {
    runContext = helpers
      .create('@mshima/generator:generator#app', {}, {experimental: true})
      .withLookups([{npmPaths: path.join(__dirname, '..', '..')}])
      .withArguments(['app'])
      .build();
  });

  afterEach(() => {
    runContext.cleanTestDirectory();
  });

  describe('Default test', () => {
    beforeEach(async () => {
      runResult = await runContext.run();
    });

    it('writes app generator file', () => {
      assert.file(path.join(ctx.targetDirectory, 'generators/app/index.js'));
    });
  });
});
