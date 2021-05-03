import path, { dirname } from 'path';
import assert from 'yeoman-assert';
import helpers from 'yeoman-test';

import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

describe('@mshima/node-package:app', () => {
  let ctx;

  beforeEach(() => {
    ctx = helpers
      .create('@mshima/node-package:app')
      .withOptions({
        enableGit: true,
        enableGenerator: true,
      })
      .withPrompts({
        name: 'generator-test',
      })
      .withLookups([{ npmPaths: path.join(__dirname, '..', '..') }])
      .build();
  });

  afterEach(() => {
    ctx.cleanTestDirectory();
  });

  describe('with sample values', () => {
    beforeEach(() => {
      return ctx.run();
    });

    it("doesn't fails", () => {
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

    it('writes generators/app/index.js file', () => {
      assert.file(path.join(ctx.targetDirectory, 'generators/app/index.js'));
    });
  });
});
