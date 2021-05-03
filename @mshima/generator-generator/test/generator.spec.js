import path, { dirname } from 'path';
import helpers from 'yeoman-test';

import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

describe('@mshima/generator:generator', () => {
  let runContext;
  let runResult;

  beforeEach(async () => {
    runContext = helpers
      .create('@mshima/generator:generator#app', {}, { experimental: true })
      .withLookups([{ npmPaths: path.join(__dirname, '..', '..') }])
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
      runResult.assertFile(path.join(runContext.targetDirectory, 'generators/app/index.js'));
    });
  });
});
