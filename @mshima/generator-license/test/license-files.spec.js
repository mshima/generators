import assert from 'yeoman-assert';
import { createRequire } from 'module';
const require = createRequire(import.meta.url);

import { licenses } from '../generators/app/index.js';

describe('Ensure all valid licenses have templates', () => {
  for (const license of licenses) {
    const expectedLicenseFilename = license.value + '.txt';
    it('license ' + license.name + ' have corresponding template file ' + expectedLicenseFilename, () => {
      assert.file(require.resolve('../generators/app/templates/' + expectedLicenseFilename));
    });
  }
});
