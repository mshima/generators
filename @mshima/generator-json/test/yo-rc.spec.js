import path, { dirname } from 'path';
import assert from 'yeoman-assert';
import helpers from 'yeoman-test';

import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

describe('@mshima/json:yo-rc', () => {
  let ctx;

  beforeEach(() => {
    ctx = helpers
      .create('@mshima/json:yo-rc', {}, { experimental: true })
      .withLookups([{ npmPaths: path.join(__dirname, '..', '..') }])
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
