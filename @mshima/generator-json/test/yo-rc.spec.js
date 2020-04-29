const path = require('path');
const assert = require('yeoman-assert');
const helpers = require('yeoman-test');

describe('@mshima/json:yo-rc', () => {
  let ctx;

  beforeEach(() => {
    ctx = helpers
      .create(
        '@mshima/json:yo-rc',
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

  describe('test generator', () => {
    beforeEach(() => {
      return ctx.run();
    });

    it('executes', () => {
      assert(true);
    });
  });
});
