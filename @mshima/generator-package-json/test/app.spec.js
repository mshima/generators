const path = require('path');
const assert = require('yeoman-assert');
const helpers = require('yeoman-test');
const Env = require('yeoman-environment');

describe.skip('Generator', () => {
  describe('Sample test', () => {
    const fileName = 'test.json';
    let temporaryDir;

    beforeEach(() =>
      helpers
        .run('json')
        .withEnvironment(() => {
          const env = Env.createEnv(undefined, {experimental: true});
          env.lookup({packagePaths: [path.join(__dirname, '..')]});
          return env;
        })
        .withOptions({
          empty: true
        })
        .inTmpDir(dir => {
          temporaryDir = dir;
        })
        .withArguments([fileName])
        .toPromise());

    it('it works', () => {
      assert.file(path.join(temporaryDir, fileName));
    });
  });
});
