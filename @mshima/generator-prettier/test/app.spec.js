import path, { dirname } from 'path';
import expect from 'expect';
import helpers from 'yeoman-test';

import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

describe('@mshima/prettier:app', () => {
  let runContext;
  let runResult;

  beforeEach(async () => {
    runContext = helpers.create('@mshima/prettier:app').withLookups([{ npmPaths: path.join(__dirname, '..', '..') }]);
  });

  afterEach(() => {
    runContext.cleanTestDirectory();
  });

  describe('with sample values', () => {
    beforeEach(async () => {
      runResult = await runContext.run();
    });

    it('should match snapshot', () => {
      expect(runResult.getSnapshot()).toMatchSnapshot();
    });
  });
});
