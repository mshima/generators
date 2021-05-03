import path, { dirname } from 'path';
import assert from 'yeoman-assert';
import helpers from 'yeoman-test';
import Env from 'yeoman-environment';

import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

describe.skip('Generator', () => {
  describe('Sample test', () => {
    const fileName = 'test.json';
    let temporaryDir;

    beforeEach(() =>
      helpers
        .run('json')
        .withEnvironment(() => {
          const env = Env.createEnv(undefined, { experimental: true });
          env.lookup({ packagePaths: [path.join(__dirname, '..')] });
          return env;
        })
        .withOptions({
          empty: true,
        })
        .inTmpDir(dir => {
          temporaryDir = dir;
        })
        .withArguments([fileName])
        .toPromise()
    );

    it('it works', () => {
      assert.file(path.join(temporaryDir, fileName));
    });
  });
});
